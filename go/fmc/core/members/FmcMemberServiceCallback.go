package members

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

func newFmcMemberServiceCallback() ifs.IServiceCallback {
	return l8c.NewServiceCallback(
		"FmcMember",
		func(e interface{}) bool { _, ok := e.(*fmc.FmcMember); return ok },
		setFmcMemberID,
		validateFmcMember,
		setMemberUserId,
	)
}

func setFmcMemberID(e interface{}) {
	entity := e.(*fmc.FmcMember)
	l8c.GenerateID(&entity.MemberId)
}

func validateFmcMember(e interface{}, vnic ifs.IVNic) error {
	entity := e.(*fmc.FmcMember)
	if err := l8c.ValidateRequired(entity.FirstName, "FirstName"); err != nil {
		return err
	}
	if err := l8c.ValidateRequired(entity.LastName, "LastName"); err != nil {
		return err
	}
	if err := l8c.ValidateRequired(entity.Email, "Email"); err != nil {
		return err
	}
	return nil
}

func setMemberUserId(e interface{}, action ifs.Action, vnic ifs.IVNic) error {
	if action != ifs.POST {
		return nil
	}
	member := e.(*fmc.FmcMember)
	member.UserId = member.Email
	return nil
}
