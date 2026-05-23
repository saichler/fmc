package meals

import (
	"fmt"

	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/fmc/notify"
	"github.com/saichler/fmc/go/types/fmc"
	ntf "github.com/saichler/l8notify/go/types/l8notify"
	"github.com/saichler/l8types/go/ifs"
)

func newFmcMealServiceCallback() ifs.IServiceCallback {
	return l8c.NewServiceCallbackWithAfter(
		"FmcMeal",
		func(e interface{}) bool { _, ok := e.(*fmc.FmcMeal); return ok },
		setFmcMealID,
		validateFmcMeal,
		nil,
		[]l8c.ActionValidateFunc{afterMealUpdate},
	)
}

func setFmcMealID(e interface{}) {
	entity := e.(*fmc.FmcMeal)
	l8c.GenerateID(&entity.MealId)
}

func validateFmcMeal(e interface{}, vnic ifs.IVNic) error {
	entity := e.(*fmc.FmcMeal)
	if err := l8c.ValidateRequired(entity.MemberId, "MemberId"); err != nil {
		return err
	}
	if entity.MealType == 0 {
		return fmt.Errorf("MealType is required")
	}
	return nil
}

func afterMealUpdate(e interface{}, action ifs.Action, vnic ifs.IVNic) error {
	meal := e.(*fmc.FmcMeal)
	if meal.AiStatus == fmc.FmcAiStatus_FMC_AI_STATUS_COMPLETE {
		fmt.Printf("[notify] AI analysis complete for meal %s (member %s)\n", meal.MealId, meal.MemberId)
		vars := map[string]string{
			"mealId":   meal.MealId,
			"memberId": meal.MemberId,
		}
		notify.SendNotification(ntf.NotifyChannel_NOTIFY_CHANNEL_WEBHOOK, meal.MemberId,
			"Your meal analysis is ready! Check your latest meal for nutrition insights.", vars)
	}
	return nil
}
