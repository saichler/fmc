package partners

import (
	"fmt"

	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

func newFmcPartnerServiceCallback() ifs.IServiceCallback {
	return l8c.NewServiceCallback(
		"FmcPartner",
		func(e interface{}) bool { _, ok := e.(*fmc.FmcPartner); return ok },
		setFmcPartnerID,
		validateFmcPartner,
	)
}

func setFmcPartnerID(e interface{}) {
	entity := e.(*fmc.FmcPartner)
	l8c.GenerateID(&entity.PartnerId)
}

func validateFmcPartner(e interface{}, vnic ifs.IVNic) error {
	entity := e.(*fmc.FmcPartner)
	if err := l8c.ValidateRequired(entity.Name, "Name"); err != nil {
		return err
	}
	if entity.PartnerType == 0 {
		return fmt.Errorf("PartnerType is required")
	}
	return nil
}
