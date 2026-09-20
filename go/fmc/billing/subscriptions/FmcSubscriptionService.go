package subscriptions

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

const (
	ServiceName = "Subscript"
	ServiceArea = byte(50)
)

func Activate(creds, dbname string, vnic ifs.IVNic) {
	sla := l8c.NewOrmSLA(ServiceName, ServiceArea, "SubscriptionId", newFmcSubscriptionServiceCallback(),
		&fmc.FmcSubscription{}, &fmc.FmcSubscriptionList{})
	l8c.ActivateService(sla, creds, dbname, vnic)
}

func Subscriptions(vnic ifs.IVNic) (ifs.IServiceHandler, bool) {
	return l8c.ServiceHandler(ServiceName, ServiceArea, vnic)
}

func Subscription(subscriptionId string, vnic ifs.IVNic) (*fmc.FmcSubscription, error) {
	result, err := l8c.GetEntity(ServiceName, ServiceArea, &fmc.FmcSubscription{SubscriptionId: subscriptionId}, vnic)
	if err != nil {
		return nil, err
	}
	return result.(*fmc.FmcSubscription), nil
}
