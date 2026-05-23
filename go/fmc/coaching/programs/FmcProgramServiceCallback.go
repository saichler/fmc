package programs

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

func newFmcProgramServiceCallback() ifs.IServiceCallback {
	return l8c.NewServiceCallback(
		"FmcProgram",
		func(e interface{}) bool { _, ok := e.(*fmc.FmcProgram); return ok },
		setFmcProgramID,
		validateFmcProgram,
	)
}

func setFmcProgramID(e interface{}) {
	entity := e.(*fmc.FmcProgram)
	l8c.GenerateID(&entity.ProgramId)
}

func validateFmcProgram(e interface{}, vnic ifs.IVNic) error {
	entity := e.(*fmc.FmcProgram)
	if err := l8c.ValidateRequired(entity.Name, "Name"); err != nil {
		return err
	}
	if err := l8c.ValidateEnum(entity.ProgramType, fmc.FmcProgramType_name, "ProgramType"); err != nil {
		return err
	}
	return nil
}
