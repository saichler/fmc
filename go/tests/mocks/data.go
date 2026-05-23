package mocks

var firstNames = []string{
	"Emma", "Liam", "Olivia", "Noah", "Ava", "James", "Sophia", "William",
	"Isabella", "Oliver", "Mia", "Benjamin", "Charlotte", "Elijah", "Amelia",
	"Lucas", "Harper", "Mason", "Evelyn", "Logan", "Abigail", "Alexander",
	"Emily", "Ethan", "Ella", "Jacob", "Elizabeth", "Michael", "Camila",
	"Daniel", "Luna", "Henry", "Sofia", "Jackson", "Avery", "Sebastian",
	"Mila", "Aiden", "Aria", "Matthew", "Scarlett", "Samuel", "Penelope",
	"David", "Layla", "Joseph", "Chloe", "Carter", "Victoria", "Owen",
}

var lastNames = []string{
	"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
	"Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
	"Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
	"Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark",
	"Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King",
	"Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green",
	"Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
	"Carter", "Roberts",
}

var timezones = []string{
	"America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
}

var glp1Medications = []string{
	"Ozempic", "Wegovy", "Mounjaro", "Zepbound",
}

var dietaryPrefs = []string{
	"No restrictions", "Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Pescatarian",
}

var referralSources = []string{
	"Google", "Trustpilot", "Friend referral", "Instagram", "Doctor referral", "GLP-1 provider",
}

var certifications = []string{
	"CNS", "RDN", "CDE", "CHES", "NBHWC", "ACE-CHC",
}

var specializations = []string{
	"Weight Management", "GLP-1 Nutrition", "Emotional Eating",
	"Sports Nutrition", "Plant-Based", "Metabolic Health",
}

var coachBios = []string{
	"Certified nutritionist with 10+ years helping clients achieve sustainable weight loss through personalized meal planning and behavioral coaching.",
	"Registered dietitian specializing in GLP-1 medication nutrition support. Passionate about helping clients optimize their health journey.",
	"Experienced coach focusing on the emotional aspects of eating. Combines evidence-based nutrition with mindfulness techniques.",
	"Sports nutrition expert who brings an active lifestyle perspective to weight management. Believes in balanced, enjoyable eating.",
	"Plant-based nutrition specialist helping clients discover the health benefits of whole-food diets while meeting their weight goals.",
}

var focusTopics = []string{
	"Meal planning strategies", "Protein intake optimization", "Emotional eating triggers",
	"GLP-1 side effect management", "Sleep and weight loss", "Stress management",
	"Hydration habits", "Portion control", "Mindful eating practice",
	"Exercise and nutrition balance", "Social eating challenges", "Plateau breaking strategies",
	"Grocery shopping tips", "Meal prep techniques", "Snacking habits",
}

var actionItems = []string{
	"Track protein intake for 3 days", "Try two new vegetable recipes this week",
	"Practice 5-minute pre-meal mindfulness", "Walk 30 minutes daily after dinner",
	"Prepare weekly meal prep on Sunday", "Drink 8 glasses of water daily",
	"Journal food emotions for one week", "Try intermittent fasting 16:8",
	"Add protein to every breakfast", "Replace one processed snack with whole foods",
}

var coachNotes = []string{
	"Client showing great progress with meal logging consistency. Recommend increasing protein targets.",
	"Discussed GLP-1 side effects and adjusted meal timing. Consider smaller, more frequent meals.",
	"Emotional eating patterns identified around evening stress. Introduced coping strategies.",
	"Weight plateau for 2 weeks - adjusted caloric targets and increased fiber intake recommendations.",
	"Excellent adherence to meal plan. Ready to introduce more variety and flexibility.",
}

var goalTitles = []string{
	"Eat protein at every meal", "Log all meals for 7 consecutive days",
	"Drink 64oz water daily", "Walk 10,000 steps daily",
	"Reduce sugar intake by 50%", "Cook at home 5 days a week",
	"Eat 5 servings of vegetables daily", "Practice mindful eating at dinner",
	"Achieve target weight by end of quarter", "Sleep 7+ hours nightly",
	"No eating after 8pm", "Try 3 new healthy recipes per week",
}

var goalDescriptions = []string{
	"Include at least 25-30g of protein in every meal to support satiety and muscle preservation.",
	"Build the habit of tracking all food intake to improve awareness and accountability.",
	"Proper hydration supports metabolism and reduces false hunger signals.",
	"Regular walking improves cardiovascular health and supports weight management.",
	"Gradual sugar reduction to improve energy levels and reduce cravings.",
}

var goalExamples = []string{
	"Eggs or Greek yogurt for breakfast, chicken or tofu for lunch, salmon or beans for dinner.",
	"Use the app to photograph and describe each meal within 5 minutes of eating.",
	"Keep a water bottle at your desk, drink a glass before each meal.",
	"Park farther away, take stairs, schedule a lunchtime walk.",
	"Replace soda with sparkling water, choose dark chocolate over candy.",
}

// Meal descriptions by type: 1=Breakfast, 2=Lunch, 3=Dinner, 4=Snack
var mealDescriptions = map[int][]string{
	1: {
		"Oatmeal with berries and almonds", "Greek yogurt parfait with granola",
		"Avocado toast with poached eggs", "Protein smoothie with banana and spinach",
		"Whole grain pancakes with fresh fruit", "Scrambled eggs with vegetables and whole wheat toast",
		"Overnight oats with chia seeds and honey", "Veggie omelet with feta cheese",
	},
	2: {
		"Grilled chicken salad with mixed greens", "Turkey and avocado wrap",
		"Quinoa bowl with roasted vegetables", "Salmon poke bowl with brown rice",
		"Mediterranean hummus plate with pita", "Chicken stir-fry with vegetables",
		"Lentil soup with whole grain bread", "Tuna salad lettuce wraps",
	},
	3: {
		"Salmon with roasted vegetables and sweet potato", "Chicken stir-fry with brown rice",
		"Lean beef tacos with black beans", "Grilled shrimp with zucchini noodles",
		"Turkey meatballs with marinara and pasta", "Baked cod with quinoa and asparagus",
		"Stuffed bell peppers with ground turkey", "Tofu curry with basmati rice",
	},
	4: {
		"Apple with peanut butter", "Mixed nuts and dark chocolate",
		"Protein smoothie with berries", "Hummus with carrot sticks",
		"Greek yogurt with honey", "Cottage cheese with pineapple",
		"Trail mix with dried fruit", "Rice cakes with almond butter",
	},
}

var aiFeedbacks = []string{
	"Good protein choice. Consider adding more fiber.",
	"Well-balanced meal with adequate protein and vegetables.",
	"High satiety score — this meal should keep you full for 3-4 hours.",
	"Consider adding a source of healthy fats for better nutrient absorption.",
	"Excellent vegetable variety. This meal covers multiple micronutrient needs.",
	"Protein intake is below target. Try adding eggs, chicken, or legumes.",
	"Great meal timing. Eating within your optimal window supports metabolism.",
	"Carbohydrate content is moderate. Good choice for sustained energy.",
	"This meal is rich in omega-3 fatty acids, supporting heart health.",
	"Low fiber content detected. Consider adding vegetables or whole grains.",
}

var aiSuggestions = []string{
	"Add a side of steamed broccoli for extra fiber and vitamins.",
	"Consider swapping white rice for brown rice or quinoa.",
	"A handful of nuts would add healthy fats and increase satiety.",
	"Try adding leafy greens to increase iron and folate intake.",
	"Consider a protein shake as a post-workout supplement.",
	"Adding avocado would provide heart-healthy monounsaturated fats.",
	"Swap the processed dressing for olive oil and lemon juice.",
	"Include fermented foods like kimchi or yogurt for gut health.",
}

var glp1AiFeedbacks = []string{
	"Protein target alert: This meal has less than 30g protein. GLP-1 patients need extra protein to preserve muscle mass.",
	"Good protein density for GLP-1 support. Continue prioritizing protein at every meal.",
	"Nutrient-dense choice. B12 and iron levels look adequate for GLP-1 medication support.",
	"Consider eating this meal more slowly due to GLP-1 effects on gastric emptying.",
	"Calorie intake is below 400 — monitor daily totals to ensure minimum 1200 kcal while on GLP-1.",
}

var recipeNames = []string{
	"High-Protein Overnight Oats", "Mediterranean Chicken Bowl",
	"Salmon Avocado Poke Bowl", "Turkey Meatball Zoodles",
	"Quinoa Stuffed Bell Peppers", "Asian Sesame Chicken Salad",
	"Lemon Herb Grilled Salmon", "Greek Yogurt Berry Parfait",
	"Chicken Tikka Masala Bowl", "Black Bean and Sweet Potato Tacos",
	"Spinach and Feta Egg Muffins", "Thai Peanut Noodle Bowl",
	"Grilled Chicken Caesar Wrap", "Mango Coconut Smoothie Bowl",
	"Baked Cod with Pesto Vegetables", "Turkey Chili with Beans",
	"Protein Pancakes with Berries", "Shrimp and Broccoli Stir-Fry",
	"Caprese Chicken with Balsamic", "Chia Seed Pudding",
}

var recipeDescriptions = []string{
	"A protein-packed breakfast that preps in 5 minutes the night before.",
	"Colorful bowl with lean protein, whole grains, and fresh vegetables.",
	"Fresh and satisfying bowl inspired by Hawaiian poke tradition.",
	"Low-carb dinner with turkey meatballs over spiralized zucchini.",
	"Hearty stuffed peppers with plant-based protein and whole grains.",
}

var ingredientNames = []string{
	"chicken breast", "salmon fillet", "brown rice", "quinoa", "avocado",
	"spinach", "broccoli", "sweet potato", "bell pepper", "olive oil",
	"Greek yogurt", "eggs", "oats", "almonds", "blueberries",
	"lemon", "garlic", "onion", "tomato", "black beans",
}

var ingredientUnits = []string{"g", "oz", "cup", "tbsp", "tsp", "piece", "ml"}

var cookingSteps = []string{
	"Preheat oven to 400°F (200°C).",
	"Season protein with salt, pepper, and herbs.",
	"Heat olive oil in a large skillet over medium-high heat.",
	"Cook until internal temperature reaches 165°F.",
	"Let rest for 5 minutes before serving.",
	"Combine all dry ingredients in a large bowl.",
	"Whisk wet ingredients separately, then fold into dry.",
	"Bake for 25-30 minutes until golden brown.",
	"Toss vegetables with dressing just before serving.",
	"Garnish with fresh herbs and serve immediately.",
}

// Habit names by category: 1=Eating, 2=Hydration, 3=Sleep, 4=Movement, 5=Mindfulness
var habitNames = map[int][]string{
	1: {
		"Eat protein at every meal", "Add vegetables to lunch",
		"Stop eating by 8pm", "No processed snacks",
	},
	2: {
		"Drink 8 glasses of water", "Start day with water before coffee",
		"Carry water bottle everywhere", "Drink water before each meal",
	},
	3: {
		"Sleep 7+ hours", "No screens after 10pm",
		"Consistent bedtime routine", "No caffeine after 2pm",
	},
	4: {
		"Walk 10,000 steps", "Take a 15-min walk after lunch",
		"Stretch for 10 minutes daily", "Take stairs instead of elevator",
	},
	5: {
		"5-minute meditation", "Journal before bed",
		"Practice gratitude daily", "Deep breathing before meals",
	},
}

var memberNotes = []string{
	"Feeling good about meal prep this week.",
	"Struggled with cravings over the weekend.",
	"Energy levels improving since increasing protein.",
	"Need help with lunch ideas for busy work days.",
	"GLP-1 nausea improving, appetite more manageable.",
}

var weightNotes = []string{
	"Morning weight, before breakfast",
	"Feeling lighter and more energetic",
	"Weekend indulgence, expected fluctuation",
	"Consistent tracking, downward trend continuing",
	"Post-workout weigh-in",
}

var partnerNames = []string{
	"HealthFirst Employers", "WellCo Medical Group", "TeleNutrition Health",
}

var partnerContacts = []string{
	"Jennifer Walsh", "Michael Torres", "Sarah Patel",
}

var programNames = []string{
	"Weight Loss Essentials", "GLP-1 Nutrition Support", "Maintenance Mode", "Emotional Eating Recovery",
}

var programDescriptions = []string{
	"Comprehensive weight loss program with personalized meal plans, weekly coaching sessions, and progress tracking.",
	"Specialized nutrition support for patients on GLP-1 medications, focusing on protein adequacy and nutrient density.",
	"Maintain your achieved weight with ongoing coaching, habit reinforcement, and flexible meal planning.",
	"Address the emotional and psychological aspects of eating through mindfulness, journaling, and coached behavioral change.",
}

var programFeatures = []string{
	"Weekly 1-on-1 coaching, AI meal analysis, personalized meal plans, progress dashboard",
	"GLP-1-specific meal plans, protein tracking, B12/iron monitoring, side effect management",
	"Monthly check-ins, flexible meal plans, habit tracking, weight maintenance strategies",
	"Bi-weekly coaching, food journal reviews, mindfulness exercises, trigger identification",
}

var cancelReasons = []string{
	"Financial constraints", "Achieved goal weight", "Moving to different program",
	"Dissatisfied with progress", "Medical reasons", "Time commitment too high",
}

var paymentFailureReasons = []string{
	"Card declined - insufficient funds", "Card expired",
	"Payment method requires authentication", "Bank declined transaction",
}

var messageContents = map[int][]string{
	1: { // Member messages
		"Hi coach, I logged my meals for the past 3 days. Can you review them?",
		"I'm struggling with portion control at dinner. Any tips?",
		"Great news - I hit my weekly step goal!",
		"The GLP-1 nausea is getting better. Smaller meals are helping.",
		"Can we discuss my meal plan for next week?",
		"I tried the salmon recipe you suggested. It was delicious!",
		"Feeling discouraged about the scale not moving this week.",
		"What snacks do you recommend for between meals?",
	},
	2: { // Coach messages
		"Great job logging consistently! I see some opportunities to boost your protein intake.",
		"Try using a smaller plate and eating slowly. It takes 20 minutes for fullness signals to reach your brain.",
		"Amazing work on the steps! Physical activity really complements your nutrition plan.",
		"That's great to hear about the nausea improving. Let's keep the smaller, frequent meals strategy.",
		"I've put together some new meal ideas based on your preferences. Check the recipes section!",
		"The salmon recipe is one of my favorites! High in omega-3s and protein.",
		"Weight fluctuations are normal. Focus on the trend over weeks, not daily numbers. You're doing great!",
		"Try Greek yogurt with berries, apple slices with almond butter, or a small handful of mixed nuts.",
	},
	3: { // System messages
		"Welcome to FitMate Coach! Your coach will reach out within 24 hours.",
		"Your meal analysis is complete. Check your dashboard for nutrition insights.",
		"Reminder: You have a coaching session scheduled for tomorrow.",
		"Congratulations! You've achieved your weekly protein target.",
		"Your weekly progress report is ready to view.",
	},
}
