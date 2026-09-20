package weightlogs

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

const (
	ServiceName = "WeightLog"
	ServiceArea = byte(40)
)

func Activate(creds, dbname string, vnic ifs.IVNic) {
	sla := l8c.NewOrmSLA(ServiceName, ServiceArea, "LogId", newFmcWeightLogServiceCallback(),
		&fmc.FmcWeightLog{}, &fmc.FmcWeightLogList{})
	l8c.ActivateService(sla, creds, dbname, vnic)
}

func WeightLogs(vnic ifs.IVNic) (ifs.IServiceHandler, bool) {
	return l8c.ServiceHandler(ServiceName, ServiceArea, vnic)
}

func WeightLog(logId string, vnic ifs.IVNic) (*fmc.FmcWeightLog, error) {
	result, err := l8c.GetEntity(ServiceName, ServiceArea, &fmc.FmcWeightLog{LogId: logId}, vnic)
	if err != nil {
		return nil, err
	}
	return result.(*fmc.FmcWeightLog), nil
}
