package mocks

import (
	"fmt"
	"math/rand"
	"time"

	l8common "github.com/saichler/l8common/go/types/l8common"
	"github.com/saichler/fmc/go/types/fmc"
)

func generateMembers(store *MockDataStore) []*fmc.FmcMember {
	members := make([]*fmc.FmcMember, 50)
	now := time.Now()

	for i := 0; i < 50; i++ {
		fn := firstNames[i%len(firstNames)]
		ln := lastNames[i%len(lastNames)]

		// Status distribution: 60% Active, 15% Trial, 10% Paused, 10% Cancelled, 5% Churned
		var status fmc.FmcMemberStatus
		switch {
		case i < 30:
			status = fmc.FmcMemberStatus_FMC_MEMBER_STATUS_ACTIVE
		case i < 38:
			status = fmc.FmcMemberStatus_FMC_MEMBER_STATUS_TRIAL
		case i < 43:
			status = fmc.FmcMemberStatus_FMC_MEMBER_STATUS_PAUSED
		case i < 48:
			status = fmc.FmcMemberStatus_FMC_MEMBER_STATUS_CANCELLED
		default:
			status = fmc.FmcMemberStatus_FMC_MEMBER_STATUS_CHURNED
		}

		// 30% on GLP-1
		onGlp1 := i%10 < 3
		glp1Med := ""
		if onGlp1 {
			glp1Med = glp1Medications[i%len(glp1Medications)]
		}

		// Weight unit: 60% LBS, 40% KG
		weightUnit := fmc.FmcWeightUnit_FMC_WEIGHT_UNIT_LBS
		heightUnit := fmc.FmcHeightUnit_FMC_HEIGHT_UNIT_IN
		if i%5 >= 3 {
			weightUnit = fmc.FmcWeightUnit_FMC_WEIGHT_UNIT_KG
			heightUnit = fmc.FmcHeightUnit_FMC_HEIGHT_UNIT_CM
		}

		heightCm := int32(155 + rand.Intn(35))
		startingWeightG := int32(70000 + rand.Intn(50000))
		targetWeightG := startingWeightG - int32(5000+rand.Intn(20000))

		enrollmentDate := now.AddDate(0, -rand.Intn(12), -rand.Intn(28))
		dob := time.Date(1970+rand.Intn(30), time.Month(1+rand.Intn(12)), 1+rand.Intn(28), 0, 0, 0, 0, time.UTC)

		partnerId := ""
		if i%10 < 2 && len(store.PartnerIDs) > 0 {
			partnerId = pickRef(store.PartnerIDs, i)
		}

		members[i] = &fmc.FmcMember{
			MemberId:        fmt.Sprintf("MBR-%03d", i+1),
			FirstName:       fn,
			LastName:        ln,
			Email:           fmt.Sprintf("%s.%s.%d@email.com", fn, ln, i+1),
			Phone:           fmt.Sprintf("555%07d", 3000000+i),
			DateOfBirth:     dob.Unix(),
			Status:          status,
			CoachId:         pickRef(store.CoachIDs, i),
			ProgramId:       pickRef(store.ProgramIDs, i),
			EnrollmentDate:  enrollmentDate.Unix(),
			HeightCm:        heightCm,
			StartingWeightG: startingWeightG,
			TargetWeightG:   targetWeightG,
			Timezone:        timezones[i%len(timezones)],
			DietaryPrefs:    dietaryPrefs[i%len(dietaryPrefs)],
			OnGlp1:          onGlp1,
			Glp1Medication:  glp1Med,
			PartnerId:       partnerId,
			ReferralSource:  referralSources[i%len(referralSources)],
			WeightUnit:      weightUnit,
			HeightUnit:      heightUnit,
			AuditInfo:       createAuditInfo(),
		}
	}
	return members
}

func generateSubscriptions(store *MockDataStore) []*fmc.FmcSubscription {
	subs := make([]*fmc.FmcSubscription, 50)
	now := time.Now()

	plans := []fmc.FmcSubscriptionPlan{
		fmc.FmcSubscriptionPlan_FMC_SUBSCRIPTION_PLAN_MONTHLY,
		fmc.FmcSubscriptionPlan_FMC_SUBSCRIPTION_PLAN_QUARTERLY,
		fmc.FmcSubscriptionPlan_FMC_SUBSCRIPTION_PLAN_ANNUAL,
	}
	planPrices := []int64{14900, 39900, 129900}

	for i := 0; i < 50; i++ {
		// Status distribution: 60% Active, 15% Trial, 10% Paused, 10% Cancelled, 5% Expired
		var status fmc.FmcSubscriptionStatus
		switch {
		case i < 30:
			status = fmc.FmcSubscriptionStatus_FMC_SUBSCRIPTION_STATUS_ACTIVE
		case i < 38:
			status = fmc.FmcSubscriptionStatus_FMC_SUBSCRIPTION_STATUS_TRIAL
		case i < 43:
			status = fmc.FmcSubscriptionStatus_FMC_SUBSCRIPTION_STATUS_PAUSED
		case i < 48:
			status = fmc.FmcSubscriptionStatus_FMC_SUBSCRIPTION_STATUS_CANCELLED
		default:
			status = fmc.FmcSubscriptionStatus_FMC_SUBSCRIPTION_STATUS_EXPIRED
		}

		planIdx := i % len(plans)
		startDate := now.AddDate(0, -rand.Intn(12), -rand.Intn(28))
		endDate := startDate.AddDate(1, 0, 0)
		trialEnd := startDate.AddDate(0, 0, 14)
		nextBilling := startDate.AddDate(0, 1, 0)
		if nextBilling.Before(now) {
			nextBilling = now.AddDate(0, 0, rand.Intn(30))
		}

		cancelReason := ""
		if status == fmc.FmcSubscriptionStatus_FMC_SUBSCRIPTION_STATUS_CANCELLED {
			cancelReason = cancelReasons[i%len(cancelReasons)]
		}

		// Generate 1-6 payment records per subscription
		numPayments := 1 + rand.Intn(6)
		payments := make([]*fmc.PaymentRecord, numPayments)
		for j := 0; j < numPayments; j++ {
			payDate := startDate.AddDate(0, j, 0)
			succeeded := true
			failReason := ""
			if j == numPayments-1 && i%10 == 9 {
				succeeded = false
				failReason = paymentFailureReasons[j%len(paymentFailureReasons)]
			}
			payments[j] = &fmc.PaymentRecord{
				PaymentId:     fmt.Sprintf("PAY-%03d-%02d", i+1, j+1),
				PaymentDate:   payDate.Unix(),
				Amount:        &l8common.Money{Amount: planPrices[planIdx]},
				StripeTxnId:   fmt.Sprintf("txn_%s_%03d_%02d", "fmc", i+1, j+1),
				Succeeded:     succeeded,
				FailureReason: failReason,
			}
		}

		subs[i] = &fmc.FmcSubscription{
			SubscriptionId:   fmt.Sprintf("SUB-%03d", i+1),
			MemberId:         pickRef(store.MemberIDs, i),
			Plan:             plans[planIdx],
			Status:           status,
			StartDate:        startDate.Unix(),
			EndDate:          endDate.Unix(),
			TrialEndDate:     trialEnd.Unix(),
			NextBilling:      nextBilling.Unix(),
			Price:            &l8common.Money{Amount: planPrices[planIdx]},
			StripeCustomerId: fmt.Sprintf("cus_fmc_%03d", i+1),
			StripeSubId:      fmt.Sprintf("sub_fmc_%03d", i+1),
			CancelReason:     cancelReason,
			Payments:         payments,
			AuditInfo:        createAuditInfo(),
		}
	}
	return subs
}
