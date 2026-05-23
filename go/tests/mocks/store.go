package mocks

type MockDataStore struct {
	// Phase 1: Core (no dependencies)
	CoachIDs   []string
	ProgramIDs []string
	PartnerIDs []string

	// Phase 2: Members (depends on CoachIDs, ProgramIDs, PartnerIDs)
	MemberIDs []string

	// Phase 3: Coaching (depends on MemberIDs, CoachIDs)
	SessionIDs []string
	GoalIDs    []string

	// Phase 4: Nutrition (depends on MemberIDs, CoachIDs)
	RecipeIDs []string
	MealIDs   []string

	// Phase 5: Progress (depends on MemberIDs, CoachIDs)
	WeightLogIDs []string
	HabitLogIDs  []string

	// Phase 6: Billing (depends on MemberIDs)
	SubscriptionIDs []string
}
