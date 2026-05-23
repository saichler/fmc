package mocks

import (
	"crypto/tls"
	"fmt"
	"net/http"
	"os"
	"time"
)

func RunMockGenerator(address, user, password string, insecure bool) {
	fmt.Printf("FMC Mock Data Generator\n")
	fmt.Printf("=======================\n")
	fmt.Printf("Server: %s\n", address)
	fmt.Printf("User: %s\n", user)
	if insecure {
		fmt.Printf("TLS: Insecure (certificate verification disabled)\n")
	}
	fmt.Printf("\n")

	httpClient := &http.Client{Timeout: 30 * time.Second}
	if insecure {
		httpClient.Transport = &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		}
	}

	client := NewFmcClient(address, httpClient)

	err := client.Authenticate(user, password)
	if err != nil {
		fmt.Printf("Authentication failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Authentication successful\n\n")

	store := &MockDataStore{}

	RunAllPhases(client, store)

	fmt.Printf("\n=== Summary ===\n")
	fmt.Printf("  Coaches:       %d\n", len(store.CoachIDs))
	fmt.Printf("  Programs:      %d\n", len(store.ProgramIDs))
	fmt.Printf("  Partners:      %d\n", len(store.PartnerIDs))
	fmt.Printf("  Members:       %d\n", len(store.MemberIDs))
	fmt.Printf("  Sessions:      %d\n", len(store.SessionIDs))
	fmt.Printf("  Goals:         %d\n", len(store.GoalIDs))
	fmt.Printf("  Recipes:       %d\n", len(store.RecipeIDs))
	fmt.Printf("  Meals:         %d\n", len(store.MealIDs))
	fmt.Printf("  Weight Logs:   %d\n", len(store.WeightLogIDs))
	fmt.Printf("  Habit Logs:    %d\n", len(store.HabitLogIDs))
	fmt.Printf("  Subscriptions: %d\n", len(store.SubscriptionIDs))
	fmt.Printf("\nMock data generation complete.\n")
}
