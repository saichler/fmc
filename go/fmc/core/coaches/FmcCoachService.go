package coaches

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

const (
	ServiceName = "Coach"
	ServiceArea = byte(10)
)

func Activate(creds, dbname string, vnic ifs.IVNic) {
	l8c.ActivateService(l8c.ServiceConfig{
		ServiceName: ServiceName, ServiceArea: ServiceArea,
		PrimaryKey: "CoachId", Callback: newFmcCoachServiceCallback(),
	}, &fmc.FmcCoach{}, &fmc.FmcCoachList{}, creds, dbname, vnic)
}

func Coaches(vnic ifs.IVNic) (ifs.IServiceHandler, bool) {
	return l8c.ServiceHandler(ServiceName, ServiceArea, vnic)
}

func Coach(coachId string, vnic ifs.IVNic) (*fmc.FmcCoach, error) {
	result, err := l8c.GetEntity(ServiceName, ServiceArea, &fmc.FmcCoach{CoachId: coachId}, vnic)
	if err != nil {
		return nil, err
	}
	return result.(*fmc.FmcCoach), nil
}
