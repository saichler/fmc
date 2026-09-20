package members

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

const (
	ServiceName = "Member"
	ServiceArea = byte(10)
)

func Activate(creds, dbname string, vnic ifs.IVNic) {
	sla := l8c.NewOrmSLA(ServiceName, ServiceArea, "MemberId", newFmcMemberServiceCallback(),
		&fmc.FmcMember{}, &fmc.FmcMemberList{})
	l8c.ActivateService(sla, creds, dbname, vnic)
}

func Members(vnic ifs.IVNic) (ifs.IServiceHandler, bool) {
	return l8c.ServiceHandler(ServiceName, ServiceArea, vnic)
}

func Member(memberId string, vnic ifs.IVNic) (*fmc.FmcMember, error) {
	result, err := l8c.GetEntity(ServiceName, ServiceArea, &fmc.FmcMember{MemberId: memberId}, vnic)
	if err != nil {
		return nil, err
	}
	return result.(*fmc.FmcMember), nil
}
