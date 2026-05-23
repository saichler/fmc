package subscriptions

import (
	"fmt"

	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/fmc/notify"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

func newFmcSubscriptionServiceCallback() ifs.IServiceCallback {
	return l8c.NewServiceCallbackWithAfter(
		"FmcSubscription",
		func(e interface{}) bool { _, ok := e.(*fmc.FmcSubscription); return ok },
		setFmcSubscriptionID,
		validateFmcSubscription,
		nil,
		[]l8c.ActionValidateFunc{afterSubscriptionUpdate},
	)
}

func setFmcSubscriptionID(e interface{}) {
	entity := e.(*fmc.FmcSubscription)
	l8c.GenerateID(&entity.SubscriptionId)
}

func validateFmcSubscription(e interface{}, vnic ifs.IVNic) error {
	entity := e.(*fmc.FmcSubscription)
	if err := l8c.ValidateRequired(entity.MemberId, "MemberId"); err != nil {
		return err
	}
	if entity.Plan == 0 {
		return fmt.Errorf("Plan is required")
	}
	return nil
}

func afterSubscriptionUpdate(e interface{}, action ifs.Action, vnic ifs.IVNic) error {
	sub := e.(*fmc.FmcSubscription)
	if sub.Status == fmc.FmcSubscriptionStatus_FMC_SUBSCRIPTION_STATUS_PAUSED && sub.CancelReason != "" {
		fmt.Printf("[notify] Subscription %s paused for member %s: %s\n", sub.SubscriptionId, sub.MemberId, sub.CancelReason)
		notify.TriggerPaymentEscalation(sub.SubscriptionId, sub.MemberId)
	}
	return nil
}
