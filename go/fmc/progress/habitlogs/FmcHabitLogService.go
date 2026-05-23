package habitlogs

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

const (
	ServiceName = "HabitLog"
	ServiceArea = byte(40)
)

func Activate(creds, dbname string, vnic ifs.IVNic) {
	l8c.ActivateService(l8c.ServiceConfig{
		ServiceName: ServiceName, ServiceArea: ServiceArea,
		PrimaryKey: "LogId", Callback: newFmcHabitLogServiceCallback(),
	}, &fmc.FmcHabitLog{}, &fmc.FmcHabitLogList{}, creds, dbname, vnic)
}

func HabitLogs(vnic ifs.IVNic) (ifs.IServiceHandler, bool) {
	return l8c.ServiceHandler(ServiceName, ServiceArea, vnic)
}

func HabitLog(logId string, vnic ifs.IVNic) (*fmc.FmcHabitLog, error) {
	result, err := l8c.GetEntity(ServiceName, ServiceArea, &fmc.FmcHabitLog{LogId: logId}, vnic)
	if err != nil {
		return nil, err
	}
	return result.(*fmc.FmcHabitLog), nil
}
