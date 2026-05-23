package coaches

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

func newFmcCoachServiceCallback() ifs.IServiceCallback {
	return l8c.NewServiceCallback(
		"FmcCoach",
		func(e interface{}) bool { _, ok := e.(*fmc.FmcCoach); return ok },
		setFmcCoachID,
		validateFmcCoach,
		setCoachUserId,
	)
}

func setFmcCoachID(e interface{}) {
	entity := e.(*fmc.FmcCoach)
	l8c.GenerateID(&entity.CoachId)
}

func validateFmcCoach(e interface{}, vnic ifs.IVNic) error {
	entity := e.(*fmc.FmcCoach)
	if err := l8c.ValidateRequired(entity.FirstName, "FirstName"); err != nil {
		return err
	}
	if err := l8c.ValidateRequired(entity.LastName, "LastName"); err != nil {
		return err
	}
	if err := l8c.ValidateRequired(entity.Email, "Email"); err != nil {
		return err
	}
	if err := l8c.ValidateRequired(entity.Certification, "Certification"); err != nil {
		return err
	}
	return nil
}

func setCoachUserId(e interface{}, action ifs.Action, vnic ifs.IVNic) error {
	if action != ifs.POST {
		return nil
	}
	coach := e.(*fmc.FmcCoach)
	coach.UserId = coach.Email
	return nil
}
