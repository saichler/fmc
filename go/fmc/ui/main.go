package main

import (
	l8c "github.com/saichler/l8common/go/common"
	"github.com/saichler/fmc/go/types/fmc"
	"github.com/saichler/l8types/go/ifs"
)

func main() {
	svr := l8c.CreateWebServer("web", registerFmcTypes)
	svr.Start()
}

func registerFmcTypes(resources ifs.IResources) {
	l8c.RegisterType(resources, &fmc.FmcMember{}, &fmc.FmcMemberList{}, "MemberId")
	l8c.RegisterType(resources, &fmc.FmcCoach{}, &fmc.FmcCoachList{}, "CoachId")
	l8c.RegisterType(resources, &fmc.FmcProgram{}, &fmc.FmcProgramList{}, "ProgramId")
	l8c.RegisterType(resources, &fmc.FmcSession{}, &fmc.FmcSessionList{}, "SessionId")
	l8c.RegisterType(resources, &fmc.FmcMessage{}, &fmc.FmcMessageList{}, "MessageId")
	l8c.RegisterType(resources, &fmc.FmcGoal{}, &fmc.FmcGoalList{}, "GoalId")
	l8c.RegisterType(resources, &fmc.FmcMeal{}, &fmc.FmcMealList{}, "MealId")
	l8c.RegisterType(resources, &fmc.FmcRecipe{}, &fmc.FmcRecipeList{}, "RecipeId")
	l8c.RegisterType(resources, &fmc.FmcWeightLog{}, &fmc.FmcWeightLogList{}, "LogId")
	l8c.RegisterType(resources, &fmc.FmcHabitLog{}, &fmc.FmcHabitLogList{}, "LogId")
	l8c.RegisterType(resources, &fmc.FmcSubscription{}, &fmc.FmcSubscriptionList{}, "SubscriptionId")
	l8c.RegisterType(resources, &fmc.FmcPartner{}, &fmc.FmcPartnerList{}, "PartnerId")
	l8c.RegisterType(resources, &fmc.FmcToolResponse{}, &fmc.FmcToolResponseList{}, "ToolName")
}
