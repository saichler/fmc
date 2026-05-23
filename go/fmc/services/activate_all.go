package services

import (
	"sync"

	"github.com/saichler/fmc/go/fmc/billing/partners"
	"github.com/saichler/fmc/go/fmc/billing/subscriptions"
	"github.com/saichler/fmc/go/fmc/coaching/goals"
	"github.com/saichler/fmc/go/fmc/coaching/messages"
	"github.com/saichler/fmc/go/fmc/coaching/programs"
	"github.com/saichler/fmc/go/fmc/coaching/sessions"
	"github.com/saichler/fmc/go/fmc/core/coaches"
	"github.com/saichler/fmc/go/fmc/core/members"
	"github.com/saichler/fmc/go/fmc/nutrition/meals"
	"github.com/saichler/fmc/go/fmc/nutrition/recipes"
	"github.com/saichler/fmc/go/fmc/progress/habitlogs"
	"github.com/saichler/fmc/go/fmc/progress/weightlogs"
	"github.com/saichler/l8types/go/ifs"
)

const parallelWorkers = 10

func ActivateAllServices(creds, dbname string, vnic ifs.IVNic) {
	all := []func(){
		func() { members.Activate(creds, dbname, vnic) },
		func() { coaches.Activate(creds, dbname, vnic) },
		func() { programs.Activate(creds, dbname, vnic) },
		func() { sessions.Activate(creds, dbname, vnic) },
		func() { messages.Activate(creds, dbname, vnic) },
		func() { goals.Activate(creds, dbname, vnic) },
		func() { meals.Activate(creds, dbname, vnic) },
		func() { recipes.Activate(creds, dbname, vnic) },
		func() { weightlogs.Activate(creds, dbname, vnic) },
		func() { habitlogs.Activate(creds, dbname, vnic) },
		func() { subscriptions.Activate(creds, dbname, vnic) },
		func() { partners.Activate(creds, dbname, vnic) },
	}

	sem := make(chan struct{}, parallelWorkers)
	var wg sync.WaitGroup

	for _, fn := range all {
		wg.Add(1)
		sem <- struct{}{}
		go func(f func()) {
			defer wg.Done()
			defer func() { <-sem }()
			f()
		}(fn)
	}
	wg.Wait()
}
