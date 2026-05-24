package main

import (
	"github.com/saichler/fmc/go/fmc/common"
	"github.com/saichler/l8bus/go/overlay/vnet"
	"os"
)

func main() {
	resources := common.CreateResources("log-vnet-"+os.Getenv("HOSTNAME"), false)
	resources.SysConfig().VnetPort = resources.SysConfig().LogConfig.VnetPort
	net := vnet.NewVNet(resources)
	net.Start()
	resources.Logger().Info("fmc log-vnet started!")
	common.WaitForSignal(resources)
}
