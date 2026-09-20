package partners

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

const (
	ServiceName = "Partner"
	ServiceArea = byte(50)
)

func Activate(creds, dbname string, vnic ifs.IVNic) {
	sla := l8c.NewOrmSLA(ServiceName, ServiceArea, "PartnerId", newFmcPartnerServiceCallback(),
		&fmc.FmcPartner{}, &fmc.FmcPartnerList{})
	l8c.ActivateService(sla, creds, dbname, vnic)
}

func Partners(vnic ifs.IVNic) (ifs.IServiceHandler, bool) {
	return l8c.ServiceHandler(ServiceName, ServiceArea, vnic)
}

func Partner(partnerId string, vnic ifs.IVNic) (*fmc.FmcPartner, error) {
	result, err := l8c.GetEntity(ServiceName, ServiceArea, &fmc.FmcPartner{PartnerId: partnerId}, vnic)
	if err != nil {
		return nil, err
	}
	return result.(*fmc.FmcPartner), nil
}
