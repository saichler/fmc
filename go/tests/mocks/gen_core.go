package mocks

import (
	"fmt"
	"time"

	l8common "github.com/saichler/l8common/go/types/l8common"
	"github.com/saichler/fmc/go/types/fmc"
)

func createAuditInfo() *l8common.AuditInfo {
	now := time.Now().Unix()
	return &l8common.AuditInfo{
		CreatedAt:  now - int64(86400*30),
		CreatedBy:  "admin",
		ModifiedAt: now,
		ModifiedBy: "admin",
	}
}

func pickRef(ids []string, index int) string {
	if len(ids) == 0 {
		return ""
	}
	return ids[index%len(ids)]
}

func generateCoaches() []*fmc.FmcCoach {
	coaches := make([]*fmc.FmcCoach, 5)
	coachFirstNames := []string{"Sarah", "David", "Maria", "James", "Rachel"}
	coachLastNames := []string{"Chen", "Williams", "Rodriguez", "Patel", "Kim"}

	for i := 0; i < 5; i++ {
		bio := ""
		if i < len(coachBios) {
			bio = coachBios[i]
		}
		coaches[i] = &fmc.FmcCoach{
			CoachId:       fmt.Sprintf("COACH-%03d", i+1),
			FirstName:     coachFirstNames[i],
			LastName:      coachLastNames[i],
			Email:         fmt.Sprintf("%s.%s@fitmate.coach", coachFirstNames[i], coachLastNames[i]),
			Phone:         fmt.Sprintf("555%07d", 1000000+i),
			Status:        fmc.FmcCoachStatus_FMC_COACH_STATUS_ACTIVE,
			Certification: certifications[i%len(certifications)],
			Specialization: specializations[i%len(specializations)],
			Bio:           bio,
			MaxClients:    15,
			ActiveClients: int32(10 + i),
			AuditInfo:     createAuditInfo(),
		}
	}
	return coaches
}

func generatePrograms() []*fmc.FmcProgram {
	programTypes := []fmc.FmcProgramType{
		fmc.FmcProgramType_FMC_PROGRAM_TYPE_WEIGHT_LOSS,
		fmc.FmcProgramType_FMC_PROGRAM_TYPE_GLP1,
		fmc.FmcProgramType_FMC_PROGRAM_TYPE_MAINTENANCE,
		fmc.FmcProgramType_FMC_PROGRAM_TYPE_EMOTIONAL,
	}
	durations := []int32{12, 16, 24, 12}
	prices := []int64{14900, 19900, 9900, 14900}

	programs := make([]*fmc.FmcProgram, 4)
	for i := 0; i < 4; i++ {
		programs[i] = &fmc.FmcProgram{
			ProgramId:     fmt.Sprintf("PROG-%03d", i+1),
			Name:          programNames[i],
			Description:   programDescriptions[i],
			ProgramType:   programTypes[i],
			IsActive:      true,
			DurationWeeks: durations[i],
			Price:         &l8common.Money{Amount: prices[i]},
			Features:      programFeatures[i],
			AuditInfo:     createAuditInfo(),
		}
	}
	return programs
}

func generatePartners() []*fmc.FmcPartner {
	partnerTypes := []fmc.FmcPartnerType{
		fmc.FmcPartnerType_FMC_PARTNER_TYPE_EMPLOYER,
		fmc.FmcPartnerType_FMC_PARTNER_TYPE_MEDICAL,
		fmc.FmcPartnerType_FMC_PARTNER_TYPE_TELEHEALTH,
	}

	partners := make([]*fmc.FmcPartner, 3)
	for i := 0; i < 3; i++ {
		partners[i] = &fmc.FmcPartner{
			PartnerId:    fmt.Sprintf("PART-%03d", i+1),
			Name:         partnerNames[i],
			PartnerType:  partnerTypes[i],
			ContactName:  partnerContacts[i],
			ContactEmail: fmt.Sprintf("contact@%s.com", partnerNames[i]),
			ContactPhone: fmt.Sprintf("555%07d", 2000000+i),
			IsActive:     true,
			ContractId:   fmt.Sprintf("CTR-2025-%03d", i+1),
			StartDate:    time.Now().AddDate(0, -6, 0).Unix(),
			MemberCount:  int32(5 + i*3),
			Notes:        fmt.Sprintf("B2B partner providing employee wellness benefits"),
			AuditInfo:    createAuditInfo(),
		}
	}
	return partners
}
