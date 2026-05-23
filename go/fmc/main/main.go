package main

import (
	"fmt"
	"github.com/saichler/fmc/go/fmc/common"
	"github.com/saichler/fmc/go/fmc/notify"
	"github.com/saichler/fmc/go/fmc/services"
	"github.com/saichler/l8bus/go/overlay/vnic"
	"github.com/saichler/l8types/go/ifs"
	"os"
	"os/exec"
	"time"
)

func main() {
	res := common.CreateResources("FmcServices", false)
	ifs.SetNetworkMode(ifs.NETWORK_K8s)
	nic := vnic.NewVirtualNetworkInterface(res, nil)
	nic.Start()
	nic.WaitForConnection()

	if len(os.Args) <= 1 {
		startDb(nic)
	}

	services.ActivateAllServices(common.DB_CREDS, common.DB_NAME, nic)
	notify.InitEscalations()

	common.WaitForSignal(res)
}

func startDb(nic ifs.IVNic) {
	_, user, pass, _, err := nic.Resources().Security().Credential(common.DB_CREDS, common.DB_NAME, nic.Resources())
	if err != nil {
		panic(common.DB_CREDS + " " + err.Error())
	}
	if user == "admin" && pass == "admin" {
		common.DB_NAME = "admin"
	}

	cmd := exec.Command("nohup", "/start-postgres.sh", common.DB_NAME, user, pass)
	out, err := cmd.Output()
	if err != nil {
		panic(err)
	}
	fmt.Println(string(out))
	time.Sleep(time.Second * 5)
}
