package recipes

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

const (
	ServiceName = "Recipe"
	ServiceArea = byte(30)
)

func Activate(creds, dbname string, vnic ifs.IVNic) {
	l8c.ActivateService(l8c.ServiceConfig{
		ServiceName: ServiceName, ServiceArea: ServiceArea,
		PrimaryKey: "RecipeId", Callback: newFmcRecipeServiceCallback(),
	}, &fmc.FmcRecipe{}, &fmc.FmcRecipeList{}, creds, dbname, vnic)
}

func Recipes(vnic ifs.IVNic) (ifs.IServiceHandler, bool) {
	return l8c.ServiceHandler(ServiceName, ServiceArea, vnic)
}

func Recipe(recipeId string, vnic ifs.IVNic) (*fmc.FmcRecipe, error) {
	result, err := l8c.GetEntity(ServiceName, ServiceArea, &fmc.FmcRecipe{RecipeId: recipeId}, vnic)
	if err != nil {
		return nil, err
	}
	return result.(*fmc.FmcRecipe), nil
}
