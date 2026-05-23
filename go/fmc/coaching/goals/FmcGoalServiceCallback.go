package goals

import (
	"fmt"

	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/fmc/notify"
	"github.com/saichler/fmc/go/types/fmc"
	ntf "github.com/saichler/l8notify/go/types/l8notify"
	"github.com/saichler/l8types/go/ifs"
)

func newFmcGoalServiceCallback() ifs.IServiceCallback {
	return l8c.NewServiceCallbackWithAfter(
		"FmcGoal",
		func(e interface{}) bool { _, ok := e.(*fmc.FmcGoal); return ok },
		setFmcGoalID,
		validateFmcGoal,
		nil,
		[]l8c.ActionValidateFunc{afterGoalUpdate},
	)
}

func setFmcGoalID(e interface{}) {
	entity := e.(*fmc.FmcGoal)
	l8c.GenerateID(&entity.GoalId)
}

func validateFmcGoal(e interface{}, vnic ifs.IVNic) error {
	entity := e.(*fmc.FmcGoal)
	if err := l8c.ValidateRequired(entity.MemberId, "MemberId"); err != nil {
		return err
	}
	if err := l8c.ValidateRequired(entity.CoachId, "CoachId"); err != nil {
		return err
	}
	if err := l8c.ValidateRequired(entity.Title, "Title"); err != nil {
		return err
	}
	return nil
}

func afterGoalUpdate(e interface{}, action ifs.Action, vnic ifs.IVNic) error {
	goal := e.(*fmc.FmcGoal)
	if goal.Status == fmc.FmcGoalStatus_FMC_GOAL_STATUS_ACHIEVED {
		fmt.Printf("[notify] Goal %s achieved for member %s: %s\n", goal.GoalId, goal.MemberId, goal.Title)
		vars := map[string]string{
			"goalId":   goal.GoalId,
			"memberId": goal.MemberId,
			"title":    goal.Title,
		}
		notify.SendNotification(ntf.NotifyChannel_NOTIFY_CHANNEL_EMAIL, "admin@fitmate.coach",
			"Goal milestone! Member {{memberId}} achieved: {{title}}", vars)
	}
	return nil
}
