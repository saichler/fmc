package goals

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

const (
	ServiceName = "Goal"
	ServiceArea = byte(20)
)

func Activate(creds, dbname string, vnic ifs.IVNic) {
	l8c.ActivateService(l8c.ServiceConfig{
		ServiceName: ServiceName, ServiceArea: ServiceArea,
		PrimaryKey: "GoalId", Callback: newFmcGoalServiceCallback(),
	}, &fmc.FmcGoal{}, &fmc.FmcGoalList{}, creds, dbname, vnic)
}

func Goals(vnic ifs.IVNic) (ifs.IServiceHandler, bool) {
	return l8c.ServiceHandler(ServiceName, ServiceArea, vnic)
}

func Goal(goalId string, vnic ifs.IVNic) (*fmc.FmcGoal, error) {
	result, err := l8c.GetEntity(ServiceName, ServiceArea, &fmc.FmcGoal{GoalId: goalId}, vnic)
	if err != nil {
		return nil, err
	}
	return result.(*fmc.FmcGoal), nil
}
