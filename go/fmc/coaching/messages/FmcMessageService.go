package messages

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

const (
	ServiceName = "Message"
	ServiceArea = byte(20)
)

func Activate(creds, dbname string, vnic ifs.IVNic) {
	sla := l8c.NewOrmSLA(ServiceName, ServiceArea, "MessageId", newFmcMessageServiceCallback(),
		&fmc.FmcMessage{}, &fmc.FmcMessageList{})
	l8c.ActivateService(sla, creds, dbname, vnic)
}

func Messages(vnic ifs.IVNic) (ifs.IServiceHandler, bool) {
	return l8c.ServiceHandler(ServiceName, ServiceArea, vnic)
}

func Message(messageId string, vnic ifs.IVNic) (*fmc.FmcMessage, error) {
	result, err := l8c.GetEntity(ServiceName, ServiceArea, &fmc.FmcMessage{MessageId: messageId}, vnic)
	if err != nil {
		return nil, err
	}
	return result.(*fmc.FmcMessage), nil
}
