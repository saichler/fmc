package messages

import (
	"fmt"

	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

func newFmcMessageServiceCallback() ifs.IServiceCallback {
	return l8c.NewServiceCallback(
		"FmcMessage",
		func(e interface{}) bool { _, ok := e.(*fmc.FmcMessage); return ok },
		setFmcMessageID,
		validateFmcMessage,
		rejectPut,
	)
}

func setFmcMessageID(e interface{}) {
	entity := e.(*fmc.FmcMessage)
	l8c.GenerateID(&entity.MessageId)
}

func validateFmcMessage(e interface{}, vnic ifs.IVNic) error {
	entity := e.(*fmc.FmcMessage)
	if err := l8c.ValidateRequired(entity.MemberId, "MemberId"); err != nil {
		return err
	}
	if err := l8c.ValidateRequired(entity.CoachId, "CoachId"); err != nil {
		return err
	}
	if err := l8c.ValidateRequired(entity.Content, "Content"); err != nil {
		return err
	}
	if err := l8c.ValidateEnum(entity.Sender, fmc.FmcMessageSender_name, "Sender"); err != nil {
		return err
	}
	return nil
}

func rejectPut(e interface{}, action ifs.Action, vnic ifs.IVNic) error {
	if action == ifs.PUT {
		return fmt.Errorf("FmcMessage is immutable — use PATCH for read receipts")
	}
	return nil
}
