package sessions

import (
	"fmt"

	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/fmc/notify"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

func newFmcSessionServiceCallback() ifs.IServiceCallback {
	return l8c.NewServiceCallbackWithAfter(
		"FmcSession",
		func(e interface{}) bool { _, ok := e.(*fmc.FmcSession); return ok },
		setFmcSessionID,
		validateFmcSession,
		nil,
		[]l8c.ActionValidateFunc{afterSessionUpdate},
	)
}

func setFmcSessionID(e interface{}) {
	entity := e.(*fmc.FmcSession)
	l8c.GenerateID(&entity.SessionId)
}

func validateFmcSession(e interface{}, vnic ifs.IVNic) error {
	entity := e.(*fmc.FmcSession)
	if err := l8c.ValidateRequired(entity.MemberId, "MemberId"); err != nil {
		return err
	}
	if err := l8c.ValidateRequired(entity.CoachId, "CoachId"); err != nil {
		return err
	}
	if err := l8c.ValidateEnum(entity.SessionType, fmc.FmcSessionType_name, "SessionType"); err != nil {
		return err
	}
	if err := l8c.ValidateDateNotZero(entity.ScheduledTime, "ScheduledTime"); err != nil {
		return err
	}
	return nil
}

func afterSessionUpdate(e interface{}, action ifs.Action, vnic ifs.IVNic) error {
	session := e.(*fmc.FmcSession)
	if session.Status == fmc.FmcSessionStatus_FMC_SESSION_STATUS_NO_SHOW {
		fmt.Printf("[notify] Session %s marked NO_SHOW for member %s\n", session.SessionId, session.MemberId)
		notify.TriggerNoShowEscalation(session.SessionId, session.MemberId, session.CoachId)
	}
	return nil
}
