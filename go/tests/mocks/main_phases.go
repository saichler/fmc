package mocks

import (
	"encoding/json"
	"fmt"

	"github.com/saichler/fmc/go/types/fmc"
)

func RunAllPhases(client *FmcClient, store *MockDataStore) {
	runPhase1(client, store) // Coaches, Programs, Partners (no dependencies)
	runPhase2(client, store) // Members (needs coaches, programs, partners)
	runPhase3(client, store) // Sessions, Goals, Messages (needs members, coaches)
	runPhase4(client, store) // Recipes, Meals (needs members, coaches)
	runPhase5(client, store) // Weight Logs, Habit Logs (needs members, coaches)
	runPhase6(client, store) // Subscriptions (needs members)
	runPhase7(client, store) // User logins (needs coaches, members on server)
}

func runPhase1(client *FmcClient, store *MockDataStore) {
	fmt.Printf("=== Phase 1: Coaches, Programs, Partners ===\n")

	coaches := generateCoaches()
	_, err := client.Post("/web/10/Coach", &fmc.FmcCoachList{List: coaches})
	if err != nil {
		fmt.Printf("  ERROR creating Coaches: %v\n", err)
	} else {
		for _, c := range coaches {
			store.CoachIDs = append(store.CoachIDs, c.CoachId)
		}
		fmt.Printf("  Created %d Coaches\n", len(coaches))
	}

	programs := generatePrograms()
	_, err = client.Post("/web/20/Program", &fmc.FmcProgramList{List: programs})
	if err != nil {
		fmt.Printf("  ERROR creating Programs: %v\n", err)
	} else {
		for _, p := range programs {
			store.ProgramIDs = append(store.ProgramIDs, p.ProgramId)
		}
		fmt.Printf("  Created %d Programs\n", len(programs))
	}

	partners := generatePartners()
	_, err = client.Post("/web/50/Partner", &fmc.FmcPartnerList{List: partners})
	if err != nil {
		fmt.Printf("  ERROR creating Partners: %v\n", err)
	} else {
		for _, p := range partners {
			store.PartnerIDs = append(store.PartnerIDs, p.PartnerId)
		}
		fmt.Printf("  Created %d Partners\n", len(partners))
	}
}

func runPhase2(client *FmcClient, store *MockDataStore) {
	fmt.Printf("=== Phase 2: Members ===\n")

	if len(store.CoachIDs) == 0 {
		fmt.Printf("  SKIPPED: no coaches available (Phase 1 may have failed)\n")
		return
	}

	members := generateMembers(store)
	_, err := client.Post("/web/10/Member", &fmc.FmcMemberList{List: members})
	if err != nil {
		fmt.Printf("  ERROR creating Members: %v\n", err)
	} else {
		for _, m := range members {
			store.MemberIDs = append(store.MemberIDs, m.MemberId)
		}
		fmt.Printf("  Created %d Members\n", len(members))
	}
}

func runPhase3(client *FmcClient, store *MockDataStore) {
	fmt.Printf("=== Phase 3: Sessions, Goals, Messages ===\n")

	if len(store.MemberIDs) == 0 {
		fmt.Printf("  SKIPPED: no members available (Phase 2 may have failed)\n")
		return
	}

	sessions := generateSessions(store)
	_, err := client.Post("/web/20/Session", &fmc.FmcSessionList{List: sessions})
	if err != nil {
		fmt.Printf("  ERROR creating Sessions: %v\n", err)
	} else {
		for _, s := range sessions {
			store.SessionIDs = append(store.SessionIDs, s.SessionId)
		}
		fmt.Printf("  Created %d Sessions\n", len(sessions))
	}

	goals := generateGoals(store)
	_, err = client.Post("/web/20/Goal", &fmc.FmcGoalList{List: goals})
	if err != nil {
		fmt.Printf("  ERROR creating Goals: %v\n", err)
	} else {
		for _, g := range goals {
			store.GoalIDs = append(store.GoalIDs, g.GoalId)
		}
		fmt.Printf("  Created %d Goals\n", len(goals))
	}

	messages := generateMessages(store)
	_, err = client.Post("/web/20/Message", &fmc.FmcMessageList{List: messages})
	if err != nil {
		fmt.Printf("  ERROR creating Messages: %v\n", err)
	} else {
		fmt.Printf("  Created %d Messages\n", len(messages))
	}
}

func runPhase4(client *FmcClient, store *MockDataStore) {
	fmt.Printf("=== Phase 4: Recipes, Meals ===\n")

	recipes := generateRecipes()
	_, err := client.Post("/web/30/Recipe", &fmc.FmcRecipeList{List: recipes})
	if err != nil {
		fmt.Printf("  ERROR creating Recipes: %v\n", err)
	} else {
		for _, r := range recipes {
			store.RecipeIDs = append(store.RecipeIDs, r.RecipeId)
		}
		fmt.Printf("  Created %d Recipes\n", len(recipes))
	}

	if len(store.MemberIDs) == 0 {
		fmt.Printf("  SKIPPED Meals: no members available\n")
		return
	}

	meals := generateMeals(store)
	_, err = client.Post("/web/30/Meal", &fmc.FmcMealList{List: meals})
	if err != nil {
		fmt.Printf("  ERROR creating Meals: %v\n", err)
	} else {
		for _, m := range meals {
			store.MealIDs = append(store.MealIDs, m.MealId)
		}
		fmt.Printf("  Created %d Meals\n", len(meals))
	}
}

func runPhase5(client *FmcClient, store *MockDataStore) {
	fmt.Printf("=== Phase 5: Weight Logs, Habit Logs ===\n")

	if len(store.MemberIDs) == 0 {
		fmt.Printf("  SKIPPED: no members available\n")
		return
	}

	weightLogs := generateWeightLogs(store)
	_, err := client.Post("/web/40/WeightLog", &fmc.FmcWeightLogList{List: weightLogs})
	if err != nil {
		fmt.Printf("  ERROR creating Weight Logs: %v\n", err)
	} else {
		for _, w := range weightLogs {
			store.WeightLogIDs = append(store.WeightLogIDs, w.LogId)
		}
		fmt.Printf("  Created %d Weight Logs\n", len(weightLogs))
	}

	habitLogs := generateHabitLogs(store)
	_, err = client.Post("/web/40/HabitLog", &fmc.FmcHabitLogList{List: habitLogs})
	if err != nil {
		fmt.Printf("  ERROR creating Habit Logs: %v\n", err)
	} else {
		for _, h := range habitLogs {
			store.HabitLogIDs = append(store.HabitLogIDs, h.LogId)
		}
		fmt.Printf("  Created %d Habit Logs\n", len(habitLogs))
	}
}

func runPhase6(client *FmcClient, store *MockDataStore) {
	fmt.Printf("=== Phase 6: Subscriptions ===\n")

	if len(store.MemberIDs) == 0 {
		fmt.Printf("  SKIPPED: no members available\n")
		return
	}

	subs := generateSubscriptions(store)
	_, err := client.Post("/web/50/Subscript", &fmc.FmcSubscriptionList{List: subs})
	if err != nil {
		fmt.Printf("  ERROR creating Subscriptions: %v\n", err)
	} else {
		for _, s := range subs {
			store.SubscriptionIDs = append(store.SubscriptionIDs, s.SubscriptionId)
		}
		fmt.Printf("  Created %d Subscriptions\n", len(subs))
	}
}

func runPhase7(client *FmcClient, store *MockDataStore) {
	fmt.Printf("=== Phase 7: User Logins ===\n")
	createUsersFromService(client, "/web/10/Coach", "FmcCoach", "coach")
	createUsersFromService(client, "/web/10/Member", "FmcMember", "member")
}

func createUsersFromService(client *FmcClient, endpoint, model, label string) {
	query := `{"text":"select * from ` + model + `"}`
	body, err := client.Get(endpoint, query)
	if err != nil {
		fmt.Printf("  ERROR fetching %ss: %v\n", label, err)
		return
	}
	var result map[string]interface{}
	if err := json.Unmarshal([]byte(body), &result); err != nil {
		fmt.Printf("  ERROR parsing %s response: %v\n", label, err)
		return
	}
	list, _ := result["list"].([]interface{})
	success, failed := 0, 0
	for _, item := range list {
		rec, ok := item.(map[string]interface{})
		if !ok {
			continue
		}
		email, _ := rec["email"].(string)
		if email == "" {
			continue
		}

		var userIdValue, portal, role string
		switch label {
		case "coach":
			userIdValue, _ = rec["coachId"].(string)
			portal = "app.html"
			role = "coach"
		case "member":
			userIdValue, _ = rec["memberId"].(string)
			portal = "member/app.html"
			role = "member"
		}
		if userIdValue == "" {
			userIdValue = email
		}

		fullName := ""
		if fn, _ := rec["firstName"].(string); fn != "" {
			fullName = fn
			if ln, _ := rec["lastName"].(string); ln != "" {
				fullName += " " + ln
			}
		}
		if fullName == "" {
			fullName = email
		}

		roles := map[string]bool{role: true}
		userData := map[string]interface{}{
			"userId":        userIdValue,
			"fullName":      fullName,
			"email":         email,
			"portal":        portal,
			"password":      map[string]string{"hash": "dDemo123!"},
			"accountStatus": "ACCOUNT_STATUS_ACTIVE",
			"roles":         roles,
		}
		if _, err := client.Post("/web/73/users", userData); err != nil {
			fmt.Printf("  FAIL %s: %s -> %v\n", label, email, err)
			failed++
		} else {
			success++
		}
	}
	fmt.Printf("  Created %d %s user accounts (%d failed)\n", success, label, failed)
}
