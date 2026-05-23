package notify

import (
	"fmt"

	"github.com/saichler/l8notify/go/escalation"
	ntf "github.com/saichler/l8notify/go/types/l8notify"
)

var (
	NoShowEscalation   *escalation.Scheduler
	PaymentEscalation  *escalation.Scheduler
)

func InitEscalations() {
	NoShowEscalation = escalation.New(func(entityID string, step *ntf.EscalationStep, message string) error {
		fmt.Printf("[escalation] no-show step %d for %s: %s\n", step.StepOrder, entityID, message)
		SendNotification(step.Channel, step.Endpoint, message, nil)
		return nil
	})

	PaymentEscalation = escalation.New(func(entityID string, step *ntf.EscalationStep, message string) error {
		fmt.Printf("[escalation] payment step %d for %s: %s\n", step.StepOrder, entityID, message)
		SendNotification(step.Channel, step.Endpoint, message, nil)
		return nil
	})
}

func TriggerNoShowEscalation(sessionID, memberID, coachID string) {
	if NoShowEscalation == nil {
		return
	}
	steps := []*ntf.EscalationStep{
		{StepId: "ns-1", StepOrder: 1, DelayMinutes: 0,
			Channel: ntf.NotifyChannel_NOTIFY_CHANNEL_EMAIL, Endpoint: "admin@fitmate.coach",
			MessageTemplate: "Session {{sessionId}} was a no-show. Coach: {{coachId}}, Member: {{memberId}}"},
		{StepId: "ns-2", StepOrder: 2, DelayMinutes: 5,
			Channel: ntf.NotifyChannel_NOTIFY_CHANNEL_EMAIL, Endpoint: "admin@fitmate.coach",
			MessageTemplate: "No-show escalation: session {{sessionId}} still unresolved"},
		{StepId: "ns-3", StepOrder: 3, DelayMinutes: 1440,
			Channel: ntf.NotifyChannel_NOTIFY_CHANNEL_EMAIL, Endpoint: "admin@fitmate.coach",
			MessageTemplate: "No-show final: session {{sessionId}} not rescheduled after 24h"},
	}
	vars := map[string]string{"sessionId": sessionID, "memberId": memberID, "coachId": coachID}
	NoShowEscalation.Schedule(sessionID, steps, vars)
}

func TriggerPaymentEscalation(subscriptionID, memberID string) {
	if PaymentEscalation == nil {
		return
	}
	steps := []*ntf.EscalationStep{
		{StepId: "pf-1", StepOrder: 1, DelayMinutes: 0,
			Channel: ntf.NotifyChannel_NOTIFY_CHANNEL_EMAIL, Endpoint: memberID,
			MessageTemplate: "Payment failed for subscription {{subscriptionId}}. Please update your payment method."},
		{StepId: "pf-2", StepOrder: 2, DelayMinutes: 4320,
			Channel: ntf.NotifyChannel_NOTIFY_CHANNEL_EMAIL, Endpoint: memberID,
			MessageTemplate: "Reminder: payment still pending for subscription {{subscriptionId}}"},
		{StepId: "pf-3", StepOrder: 3, DelayMinutes: 10080,
			Channel: ntf.NotifyChannel_NOTIFY_CHANNEL_EMAIL, Endpoint: "admin@fitmate.coach",
			MessageTemplate: "Member {{memberId}} has unpaid invoice for subscription {{subscriptionId}}"},
		{StepId: "pf-4", StepOrder: 4, DelayMinutes: 20160,
			Channel: ntf.NotifyChannel_NOTIFY_CHANNEL_EMAIL, Endpoint: "admin@fitmate.coach",
			MessageTemplate: "Auto-pause: subscription {{subscriptionId}} for member {{memberId}} paused due to non-payment"},
	}
	vars := map[string]string{"subscriptionId": subscriptionID, "memberId": memberID}
	PaymentEscalation.Schedule(subscriptionID, steps, vars)
}
