package sessions

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

const (
	ServiceName = "Session"
	ServiceArea = byte(20)
)

func Activate(creds, dbname string, vnic ifs.IVNic) {
	sla := l8c.NewOrmSLA(ServiceName, ServiceArea, "SessionId", newFmcSessionServiceCallback(),
		&fmc.FmcSession{}, &fmc.FmcSessionList{})
	l8c.ActivateService(sla, creds, dbname, vnic)
}

func Sessions(vnic ifs.IVNic) (ifs.IServiceHandler, bool) {
	return l8c.ServiceHandler(ServiceName, ServiceArea, vnic)
}

func Session(sessionId string, vnic ifs.IVNic) (*fmc.FmcSession, error) {
	result, err := l8c.GetEntity(ServiceName, ServiceArea, &fmc.FmcSession{SessionId: sessionId}, vnic)
	if err != nil {
		return nil, err
	}
	return result.(*fmc.FmcSession), nil
}
