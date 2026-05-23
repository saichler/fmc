package mocks

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/saichler/fmc/go/types/fmc"
)

func generateWeightLogs(store *MockDataStore) []*fmc.FmcWeightLog {
	logs := make([]*fmc.FmcWeightLog, 500)
	now := time.Now()

	for i := 0; i < 500; i++ {
		memberIdx := i % len(store.MemberIDs)
		memberId := store.MemberIDs[memberIdx]
		coachId := pickRef(store.CoachIDs, memberIdx)

		// Simulate gradual weight loss: each entry for the same member is slightly lower
		entriesPerMember := i / len(store.MemberIDs)
		baseWeight := int32(80000 + rand.Intn(30000))
		weightLoss := int32(entriesPerMember * (200 + rand.Intn(300)))
		fluctuation := int32(rand.Intn(1000) - 500)
		weight := baseWeight - weightLoss + fluctuation
		if weight < 50000 {
			weight = int32(50000 + rand.Intn(5000))
		}

		logDate := now.AddDate(0, 0, -(500-i)/len(store.MemberIDs))
		logDate = time.Date(logDate.Year(), logDate.Month(), logDate.Day(),
			7, rand.Intn(30), 0, 0, logDate.Location())

		logs[i] = &fmc.FmcWeightLog{
			LogId:    fmt.Sprintf("WL-%04d", i+1),
			MemberId: memberId,
			CoachId:  coachId,
			LogDate:  logDate.Unix(),
			WeightG:  weight,
			Notes:    weightNotes[i%len(weightNotes)],
			AuditInfo: createAuditInfo(),
		}
	}
	return logs
}

func generateHabitLogs(store *MockDataStore) []*fmc.FmcHabitLog {
	logs := make([]*fmc.FmcHabitLog, 1000)
	now := time.Now()

	categories := []fmc.FmcHabitCategory{
		fmc.FmcHabitCategory_FMC_HABIT_CATEGORY_EATING,
		fmc.FmcHabitCategory_FMC_HABIT_CATEGORY_HYDRATION,
		fmc.FmcHabitCategory_FMC_HABIT_CATEGORY_SLEEP,
		fmc.FmcHabitCategory_FMC_HABIT_CATEGORY_MOVEMENT,
		fmc.FmcHabitCategory_FMC_HABIT_CATEGORY_MINDFULNESS,
	}

	for i := 0; i < 1000; i++ {
		memberIdx := i % len(store.MemberIDs)
		memberId := store.MemberIDs[memberIdx]
		coachId := pickRef(store.CoachIDs, memberIdx)

		cat := categories[i%len(categories)]
		catInt := int(cat)
		names := habitNames[catInt]
		habitName := names[i%len(names)]

		logDate := now.AddDate(0, 0, -rand.Intn(30))
		logDate = time.Date(logDate.Year(), logDate.Month(), logDate.Day(),
			20+rand.Intn(3), rand.Intn(60), 0, 0, logDate.Location())

		// 70% completed, 30% missed
		completed := i%10 < 7
		streak := int32(0)
		if completed {
			streak = int32(1 + rand.Intn(30))
		}

		logs[i] = &fmc.FmcHabitLog{
			LogId:     fmt.Sprintf("HL-%04d", i+1),
			MemberId:  memberId,
			CoachId:   coachId,
			LogDate:   logDate.Unix(),
			HabitName: habitName,
			Category:  cat,
			Completed: completed,
			Notes:     "",
			StreakDays: streak,
			AuditInfo: createAuditInfo(),
		}
	}
	return logs
}
