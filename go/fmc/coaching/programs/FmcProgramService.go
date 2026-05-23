package programs

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

const (
	ServiceName = "Program"
	ServiceArea = byte(20)
)

func Activate(creds, dbname string, vnic ifs.IVNic) {
	l8c.ActivateService(l8c.ServiceConfig{
		ServiceName: ServiceName, ServiceArea: ServiceArea,
		PrimaryKey: "ProgramId", Callback: newFmcProgramServiceCallback(),
	}, &fmc.FmcProgram{}, &fmc.FmcProgramList{}, creds, dbname, vnic)
}

func Programs(vnic ifs.IVNic) (ifs.IServiceHandler, bool) {
	return l8c.ServiceHandler(ServiceName, ServiceArea, vnic)
}

func Program(programId string, vnic ifs.IVNic) (*fmc.FmcProgram, error) {
	result, err := l8c.GetEntity(ServiceName, ServiceArea, &fmc.FmcProgram{ProgramId: programId}, vnic)
	if err != nil {
		return nil, err
	}
	return result.(*fmc.FmcProgram), nil
}
