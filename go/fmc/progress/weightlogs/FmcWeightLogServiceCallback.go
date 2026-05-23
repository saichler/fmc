package weightlogs

import (
	"fmt"

	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

func newFmcWeightLogServiceCallback() ifs.IServiceCallback {
	return l8c.NewServiceCallback(
		"FmcWeightLog",
		func(e interface{}) bool { _, ok := e.(*fmc.FmcWeightLog); return ok },
		setFmcWeightLogID,
		validateFmcWeightLog,
	)
}

func setFmcWeightLogID(e interface{}) {
	entity := e.(*fmc.FmcWeightLog)
	l8c.GenerateID(&entity.LogId)
}

func validateFmcWeightLog(e interface{}, vnic ifs.IVNic) error {
	entity := e.(*fmc.FmcWeightLog)
	if err := l8c.ValidateRequired(entity.MemberId, "MemberId"); err != nil {
		return err
	}
	if entity.LogDate == 0 {
		return fmt.Errorf("LogDate is required")
	}
	if entity.WeightG == 0 {
		return fmt.Errorf("WeightG is required")
	}
	return nil
}
