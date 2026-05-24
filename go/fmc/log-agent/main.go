package main

import (
	"fmt"
	"os"

	"github.com/saichler/l8bus/go/overlay/vnic"
	"github.com/saichler/l8logfusion/go/agent/logs"
	"github.com/saichler/l8logfusion/go/types/l8logf"
	"github.com/saichler/l8utils/go/utils/ipsegment"
	"github.com/saichler/l8utils/go/utils/shared"
)

func main() {
	logsDirectory := "/data/logs/fmc"
	ip := os.Getenv("NODE_IP")
	if ip == "" {
		fmt.Println("Env variable NODE_IP is not set, using machine ip")
		ip = ipsegment.MachineIP
	}

	logpath := os.Getenv("LOGPATH")
	if logpath == "" {
		fmt.Println("Env variable LOGPATH is not set, using " + logsDirectory)
		logpath = logsDirectory
	}

	logfile := os.Getenv("LOGFILE")
	if logfile == "" {
		fmt.Println("Env variable LOGFILE is not set, using *")
		logfile = "*"
	}

	r := shared.ResourcesOf("logs", 0, 30)
	r.SysConfig().RemoteVnet = ip
	r.SysConfig().VnetPort = r.Security().NewSystemConfig().LogConfig.VnetPort

	nic := vnic.NewVirtualNetworkInterface(r, nil)
	nic.Start()
	nic.WaitForConnection()

	lc := &l8logf.L8LogConfig{Path: logpath, Name: logfile}
	collector := logs.NewLogCollector(lc, nic)
	collector.Collect()
}
