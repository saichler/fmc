package meals

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

const (
	ServiceName = "Meal"
	ServiceArea = byte(30)
)

func Activate(creds, dbname string, vnic ifs.IVNic) {
	l8c.ActivateService(l8c.ServiceConfig{
		ServiceName: ServiceName, ServiceArea: ServiceArea,
		PrimaryKey: "MealId", Callback: newFmcMealServiceCallback(),
	}, &fmc.FmcMeal{}, &fmc.FmcMealList{}, creds, dbname, vnic)
}

func Meals(vnic ifs.IVNic) (ifs.IServiceHandler, bool) {
	return l8c.ServiceHandler(ServiceName, ServiceArea, vnic)
}

func Meal(mealId string, vnic ifs.IVNic) (*fmc.FmcMeal, error) {
	result, err := l8c.GetEntity(ServiceName, ServiceArea, &fmc.FmcMeal{MealId: mealId}, vnic)
	if err != nil {
		return nil, err
	}
	return result.(*fmc.FmcMeal), nil
}
