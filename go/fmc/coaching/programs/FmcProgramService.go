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
	sla := l8c.NewOrmSLA(ServiceName, ServiceArea, "ProgramId", newFmcProgramServiceCallback(),
		&fmc.FmcProgram{}, &fmc.FmcProgramList{})
	l8c.ActivateService(sla, creds, dbname, vnic)
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
