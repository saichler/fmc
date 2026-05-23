package main

import (
	"github.com/saichler/fmc/go/fmc/common"
	"github.com/saichler/l8bus/go/overlay/vnet"
	"os"
)

func main() {
	resources := common.CreateResources("vnet-"+os.Getenv("HOSTNAME"), false)
	net := vnet.NewVNet(resources)
	net.Start()
	resources.Logger().Info("fmc vnet started!")
	common.WaitForSignal(resources)
}
