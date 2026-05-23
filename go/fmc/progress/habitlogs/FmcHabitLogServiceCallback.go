package habitlogs

import (
	"fmt"

	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

func newFmcHabitLogServiceCallback() ifs.IServiceCallback {
	return l8c.NewServiceCallback(
		"FmcHabitLog",
		func(e interface{}) bool { _, ok := e.(*fmc.FmcHabitLog); return ok },
		setFmcHabitLogID,
		validateFmcHabitLog,
	)
}

func setFmcHabitLogID(e interface{}) {
	entity := e.(*fmc.FmcHabitLog)
	l8c.GenerateID(&entity.LogId)
}

func validateFmcHabitLog(e interface{}, vnic ifs.IVNic) error {
	entity := e.(*fmc.FmcHabitLog)
	if err := l8c.ValidateRequired(entity.MemberId, "MemberId"); err != nil {
		return err
	}
	if err := l8c.ValidateRequired(entity.HabitName, "HabitName"); err != nil {
		return err
	}
	if entity.LogDate == 0 {
		return fmt.Errorf("LogDate is required")
	}
	return nil
}
