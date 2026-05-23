package mocks

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/saichler/fmc/go/types/fmc"
)

func generateSessions(store *MockDataStore) []*fmc.FmcSession {
	sessions := make([]*fmc.FmcSession, 200)
	now := time.Now()

	sessionTypes := []fmc.FmcSessionType{
		fmc.FmcSessionType_FMC_SESSION_TYPE_VIDEO_CALL,
		fmc.FmcSessionType_FMC_SESSION_TYPE_PHONE_CALL,
		fmc.FmcSessionType_FMC_SESSION_TYPE_TEXT,
	}

	for i := 0; i < 200; i++ {
		memberIdx := i % len(store.MemberIDs)
		memberId := store.MemberIDs[memberIdx]
		coachId := pickRef(store.CoachIDs, memberIdx)

		// Status distribution: 50% Completed, 20% Scheduled, 10% Cancelled, 10% No-show, 10% In-progress
		var status fmc.FmcSessionStatus
		var scheduledTime, startT, endT int64
		var duration int32

		switch {
		case i < 100:
			status = fmc.FmcSessionStatus_FMC_SESSION_STATUS_COMPLETED
			scheduledTime = now.AddDate(0, 0, -rand.Intn(90)).Unix()
			startT = scheduledTime
			duration = int32(30 + rand.Intn(31))
			endT = startT + int64(duration*60)
		case i < 140:
			status = fmc.FmcSessionStatus_FMC_SESSION_STATUS_SCHEDULED
			scheduledTime = now.AddDate(0, 0, 1+rand.Intn(30)).Unix()
		case i < 160:
			status = fmc.FmcSessionStatus_FMC_SESSION_STATUS_CANCELLED
			scheduledTime = now.AddDate(0, 0, -rand.Intn(30)).Unix()
		case i < 180:
			status = fmc.FmcSessionStatus_FMC_SESSION_STATUS_NO_SHOW
			scheduledTime = now.AddDate(0, 0, -rand.Intn(30)).Unix()
		default:
			status = fmc.FmcSessionStatus_FMC_SESSION_STATUS_IN_PROGRESS
			scheduledTime = now.Unix()
			startT = scheduledTime
			duration = int32(15 + rand.Intn(15))
		}

		cNotes := ""
		mNotes := ""
		actions := ""
		if status == fmc.FmcSessionStatus_FMC_SESSION_STATUS_COMPLETED {
			cNotes = coachNotes[i%len(coachNotes)]
			mNotes = memberNotes[i%len(memberNotes)]
			actions = actionItems[i%len(actionItems)]
		}

		sessions[i] = &fmc.FmcSession{
			SessionId:     fmt.Sprintf("SESS-%03d", i+1),
			MemberId:      memberId,
			CoachId:       coachId,
			SessionType:   sessionTypes[i%len(sessionTypes)],
			Status:        status,
			ScheduledTime: scheduledTime,
			StartTime:     startT,
			EndTime:       endT,
			DurationMin:   duration,
			CoachNotes:    cNotes,
			MemberNotes:   mNotes,
			ActionItems:   actions,
			FocusTopic:    focusTopics[i%len(focusTopics)],
			WeekNumber:    int32(1 + i%16),
			AuditInfo:     createAuditInfo(),
		}
	}
	return sessions
}

func generateGoals(store *MockDataStore) []*fmc.FmcGoal {
	goals := make([]*fmc.FmcGoal, 100)
	now := time.Now()

	for i := 0; i < 100; i++ {
		memberIdx := i % len(store.MemberIDs)
		memberId := store.MemberIDs[memberIdx]
		coachId := pickRef(store.CoachIDs, memberIdx)
		sessionId := pickRef(store.SessionIDs, i)

		// Status distribution: 40% Active, 30% Achieved, 20% Missed, 10% Replaced
		var status fmc.FmcGoalStatus
		switch {
		case i < 40:
			status = fmc.FmcGoalStatus_FMC_GOAL_STATUS_ACTIVE
		case i < 70:
			status = fmc.FmcGoalStatus_FMC_GOAL_STATUS_ACHIEVED
		case i < 90:
			status = fmc.FmcGoalStatus_FMC_GOAL_STATUS_MISSED
		default:
			status = fmc.FmcGoalStatus_FMC_GOAL_STATUS_REPLACED
		}

		startDate := now.AddDate(0, 0, -rand.Intn(60))
		targetDate := startDate.AddDate(0, 0, 7+rand.Intn(21))

		// Generate 1-3 checkpoints per goal
		numCheckpoints := 1 + rand.Intn(3)
		checkpoints := make([]*fmc.GoalCheckpoint, numCheckpoints)
		for j := 0; j < numCheckpoints; j++ {
			checkDate := startDate.AddDate(0, 0, (j+1)*7)
			completed := status == fmc.FmcGoalStatus_FMC_GOAL_STATUS_ACHIEVED || (j < numCheckpoints/2)
			checkpoints[j] = &fmc.GoalCheckpoint{
				CheckpointId: fmt.Sprintf("CP-%03d-%02d", i+1, j+1),
				CheckDate:    checkDate.Unix(),
				Completed:    completed,
				Notes:        fmt.Sprintf("Week %d check-in", j+1),
			}
		}

		goals[i] = &fmc.FmcGoal{
			GoalId:      fmt.Sprintf("GOAL-%03d", i+1),
			MemberId:    memberId,
			CoachId:     coachId,
			SessionId:   sessionId,
			Title:       goalTitles[i%len(goalTitles)],
			Description: goalDescriptions[i%len(goalDescriptions)],
			Status:      status,
			StartDate:   startDate.Unix(),
			TargetDate:  targetDate.Unix(),
			WeekNumber:  int32(1 + i%16),
			Examples:    goalExamples[i%len(goalExamples)],
			Checkpoints: checkpoints,
			AuditInfo:   createAuditInfo(),
		}
	}
	return goals
}

func generateMessages(store *MockDataStore) []*fmc.FmcMessage {
	messages := make([]*fmc.FmcMessage, 500)
	now := time.Now()

	memberMsgs := messageContents[1]
	coachMsgs := messageContents[2]
	systemMsgs := messageContents[3]

	for i := 0; i < 500; i++ {
		memberIdx := i % len(store.MemberIDs)
		memberId := store.MemberIDs[memberIdx]
		coachId := pickRef(store.CoachIDs, memberIdx)

		// Sender distribution: 45% Member, 45% Coach, 10% System
		var sender fmc.FmcMessageSender
		var content string
		switch {
		case i < 225:
			sender = fmc.FmcMessageSender_FMC_MESSAGE_SENDER_MEMBER
			content = memberMsgs[i%len(memberMsgs)]
		case i < 450:
			sender = fmc.FmcMessageSender_FMC_MESSAGE_SENDER_COACH
			content = coachMsgs[i%len(coachMsgs)]
		default:
			sender = fmc.FmcMessageSender_FMC_MESSAGE_SENDER_SYSTEM
			content = systemMsgs[i%len(systemMsgs)]
		}

		sentAt := now.AddDate(0, 0, -rand.Intn(60)).Add(
			time.Duration(8+rand.Intn(12)) * time.Hour).Add(
			time.Duration(rand.Intn(60)) * time.Minute)

		// 80% read, 20% unread
		isRead := i%5 != 0
		var readAt int64
		if isRead {
			readAt = sentAt.Add(time.Duration(1+rand.Intn(120)) * time.Minute).Unix()
		}

		messages[i] = &fmc.FmcMessage{
			MessageId: fmt.Sprintf("MSG-%04d", i+1),
			MemberId:  memberId,
			CoachId:   coachId,
			Sender:    sender,
			Content:   content,
			SentAt:    sentAt.Unix(),
			IsRead:    isRead,
			ReadAt:    readAt,
		}
	}
	return messages
}
