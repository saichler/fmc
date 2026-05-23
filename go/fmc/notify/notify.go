package notify

import (
	"fmt"

	ntfchannel "github.com/saichler/l8notify/go/channel"
	ntf "github.com/saichler/l8notify/go/types/l8notify"
	"github.com/saichler/l8notify/go/template"
)

var smtpConfig *ntf.SmtpConfig

func SetSmtpConfig(cfg *ntf.SmtpConfig) {
	smtpConfig = cfg
}

func SendNotification(channel ntf.NotifyChannel, endpoint, tmpl string, vars map[string]string) {
	msg := template.Render(tmpl, vars)
	target := &ntf.NotifyTarget{
		Channel:  channel,
		Endpoint: endpoint,
		Template: tmpl,
	}
	result := ntfchannel.Dispatch(target, msg, smtpConfig, nil)
	if result != nil && result.Status == ntf.DeliveryStatus_DELIVERY_STATUS_FAILED {
		fmt.Printf("[notify] delivery failed to %s: %s\n", endpoint, result.ErrorMessage)
	}
}
