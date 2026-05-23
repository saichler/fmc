package mocks

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/saichler/fmc/go/types/fmc"
)

func generateRecipes() []*fmc.FmcRecipe {
	recipes := make([]*fmc.FmcRecipe, 100)

	categories := []fmc.FmcRecipeCategory{
		fmc.FmcRecipeCategory_FMC_RECIPE_CATEGORY_BREAKFAST,
		fmc.FmcRecipeCategory_FMC_RECIPE_CATEGORY_LUNCH,
		fmc.FmcRecipeCategory_FMC_RECIPE_CATEGORY_DINNER,
		fmc.FmcRecipeCategory_FMC_RECIPE_CATEGORY_SNACK,
	}

	for i := 0; i < 100; i++ {
		cat := categories[i%len(categories)]
		calories := int32(200 + rand.Intn(500))
		proteinG := int32(15 + rand.Intn(35))
		fiberG := int32(3 + rand.Intn(12))
		carbsG := int32(20 + rand.Intn(50))
		fatG := int32(5 + rand.Intn(25))

		// 3-6 ingredients per recipe
		numIngredients := 3 + rand.Intn(4)
		ingredients := make([]*fmc.RecipeIngredient, numIngredients)
		for j := 0; j < numIngredients; j++ {
			ingredients[j] = &fmc.RecipeIngredient{
				IngredientId: fmt.Sprintf("ING-%03d-%02d", i+1, j+1),
				Name:         ingredientNames[j%len(ingredientNames)],
				Quantity:     fmt.Sprintf("%d", 50+rand.Intn(200)),
				Unit:         ingredientUnits[j%len(ingredientUnits)],
				Calories:     int32(20 + rand.Intn(100)),
				ProteinG:     int32(2 + rand.Intn(15)),
			}
		}

		// 3-5 steps per recipe
		numSteps := 3 + rand.Intn(3)
		steps := make([]*fmc.RecipeStep, numSteps)
		for j := 0; j < numSteps; j++ {
			steps[j] = &fmc.RecipeStep{
				StepId:      fmt.Sprintf("STEP-%03d-%02d", i+1, j+1),
				StepNumber:  int32(j + 1),
				Instruction: cookingSteps[j%len(cookingSteps)],
				DurationMin: int32(3 + rand.Intn(12)),
			}
		}

		// Assign 1-3 dietary tags
		numTags := 1 + rand.Intn(3)
		tags := make([]fmc.FmcDietaryTag, numTags)
		for j := 0; j < numTags; j++ {
			tags[j] = fmc.FmcDietaryTag(1 + (i+j)%8)
		}

		name := recipeNames[i%len(recipeNames)]
		desc := recipeDescriptions[i%len(recipeDescriptions)]

		recipes[i] = &fmc.FmcRecipe{
			RecipeId:      fmt.Sprintf("RCP-%03d", i+1),
			Name:          name,
			Description:   desc,
			Category:      cat,
			PrepTimeMin:   int32(5 + rand.Intn(20)),
			CookTimeMin:   int32(10 + rand.Intn(30)),
			Servings:      int32(1 + rand.Intn(4)),
			Calories:      calories,
			ProteinG:      proteinG,
			FiberG:        fiberG,
			CarbsG:        carbsG,
			FatG:          fatG,
			ContributedBy: pickRef([]string{"COACH-001", "COACH-002", "COACH-003"}, i),
			IsValidated:   true,
			IsPublished:   i%10 != 9,
			DietaryTags:   tags,
			Ingredients:   ingredients,
			Steps:         steps,
			AuditInfo:     createAuditInfo(),
		}
	}
	return recipes
}

func generateMeals(store *MockDataStore) []*fmc.FmcMeal {
	meals := make([]*fmc.FmcMeal, 1000)
	now := time.Now()

	mealTypes := []fmc.FmcMealType{
		fmc.FmcMealType_FMC_MEAL_TYPE_BREAKFAST,
		fmc.FmcMealType_FMC_MEAL_TYPE_LUNCH,
		fmc.FmcMealType_FMC_MEAL_TYPE_DINNER,
		fmc.FmcMealType_FMC_MEAL_TYPE_SNACK,
	}

	sources := []fmc.FmcMealSource{
		fmc.FmcMealSource_FMC_MEAL_SOURCE_PHOTO,
		fmc.FmcMealSource_FMC_MEAL_SOURCE_TEXT,
	}

	for i := 0; i < 1000; i++ {
		memberIdx := i % len(store.MemberIDs)
		memberId := store.MemberIDs[memberIdx]
		coachId := pickRef(store.CoachIDs, memberIdx)

		mt := mealTypes[i%len(mealTypes)]
		mealTypeInt := int(mt)
		descs := mealDescriptions[mealTypeInt]
		desc := descs[i%len(descs)]

		loggedAt := now.AddDate(0, 0, -rand.Intn(60))
		hour := 7 + (mealTypeInt-1)*4 + rand.Intn(3)
		if hour > 21 {
			hour = 21
		}
		loggedAt = time.Date(loggedAt.Year(), loggedAt.Month(), loggedAt.Day(),
			hour, rand.Intn(60), 0, 0, loggedAt.Location())

		calories := int32(200 + rand.Intn(600))
		proteinG := int32(10 + rand.Intn(40))
		fiberG := int32(2 + rand.Intn(10))
		carbsG := int32(15 + rand.Intn(60))
		fatG := int32(5 + rand.Intn(30))
		satiety := int32(4 + rand.Intn(7))
		confidence := int32(70 + rand.Intn(26))

		// Select AI feedback — GLP-1 members get GLP-1-specific feedback
		feedback := aiFeedbacks[i%len(aiFeedbacks)]
		if memberIdx%10 < 3 && i%3 == 0 {
			feedback = glp1AiFeedbacks[i%len(glp1AiFeedbacks)]
		}
		suggestion := aiSuggestions[i%len(aiSuggestions)]

		// Generate 2-5 nutrients per meal
		numNutrients := 2 + rand.Intn(4)
		nutrients := generateMealNutrients(i, numNutrients)

		meals[i] = &fmc.FmcMeal{
			MealId:        fmt.Sprintf("MEAL-%04d", i+1),
			MemberId:      memberId,
			CoachId:       coachId,
			MealType:      mt,
			Source:         sources[i%len(sources)],
			Description:   desc,
			LoggedAt:      loggedAt.Unix(),
			Calories:      calories,
			ProteinG:      proteinG,
			FiberG:        fiberG,
			CarbsG:        carbsG,
			FatG:          fatG,
			SatietyScore:  satiety,
			AiFeedback:    feedback,
			AiSuggestions: suggestion,
			ConfidencePct: confidence,
			AiStatus:      fmc.FmcAiStatus_FMC_AI_STATUS_COMPLETE,
			Nutrients:     nutrients,
			AuditInfo:     createAuditInfo(),
		}
	}
	return meals
}

var nutrientNames = []string{
	"Vitamin C", "Vitamin D", "Vitamin B12", "Iron", "Calcium",
	"Potassium", "Magnesium", "Zinc", "Folate", "Vitamin A",
}

func generateMealNutrients(mealIdx, count int) []*fmc.MealNutrient {
	nutrients := make([]*fmc.MealNutrient, count)
	for j := 0; j < count; j++ {
		nutrients[j] = &fmc.MealNutrient{
			NutrientId: fmt.Sprintf("NUT-%04d-%02d", mealIdx+1, j+1),
			Name:       nutrientNames[(mealIdx+j)%len(nutrientNames)],
			AmountMg:   int32(5 + rand.Intn(500)),
			DailyPct:   int32(5 + rand.Intn(50)),
		}
	}
	return nutrients
}
