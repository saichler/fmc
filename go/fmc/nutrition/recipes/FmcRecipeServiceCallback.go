package recipes

import (
	"fmt"

	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

func newFmcRecipeServiceCallback() ifs.IServiceCallback {
	return l8c.NewServiceCallback(
		"FmcRecipe",
		func(e interface{}) bool { _, ok := e.(*fmc.FmcRecipe); return ok },
		setFmcRecipeID,
		validateFmcRecipe,
	)
}

func setFmcRecipeID(e interface{}) {
	entity := e.(*fmc.FmcRecipe)
	l8c.GenerateID(&entity.RecipeId)
}

func validateFmcRecipe(e interface{}, vnic ifs.IVNic) error {
	entity := e.(*fmc.FmcRecipe)
	if err := l8c.ValidateRequired(entity.Name, "Name"); err != nil {
		return err
	}
	if entity.Category == 0 {
		return fmt.Errorf("Category is required")
	}
	return nil
}
