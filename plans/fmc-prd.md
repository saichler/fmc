# FMC - FitMate Coach PRD

## Product Overview

FMC (FitMate Coach) is a B2C 1-on-1 weight loss coaching platform that combines certified human nutrition coaches with AI-powered meal analysis. The platform pairs each member with a dedicated nutrition coach who provides weekly sessions (alternating phone/video calls and text-based sessions), unlimited between-session messaging, and personalized habit-based guidance. An AI meal advisor analyzes food photos and text descriptions to provide instant nutritional feedback (calories, protein, fiber, satiety score), which coaches use to identify patterns and set targeted weekly goals. The platform is purely nutrition-focused with no exercise/workout features.

**Key differentiators:**
- Human-led coaching + AI-powered meal feedback at $69/month (vs. $200-500+ for traditional 1-on-1 coaching)
- Habit-based approach, not meal plans or calorie counting
- Specialized GLP-1 companion program for Ozempic/Wegovy/Mounjaro/Zepbound users
- AI pattern detection for hunger triggers, hidden calorie sources, and eating habits
- Free public tools (protein calculator, meal plan generator) as lead generation funnel

**Project prefix:** `/fmc/`
**Database name:** `fmc`

---

## User Types

| User Type | Description |
|-----------|-------------|
| **Member** | End consumer seeking weight loss coaching. Logs meals (photo/text), chats with coach in real-time, tracks progress via the member portal. This is the primary user — the entire product experience centers on the member. |
| **Coach** | Certified nutrition coach employed by FMC. Reviews AI meal insights, conducts sessions, sets goals, messages members. Uses the coach portal (desktop + mobile). |
| **Admin** | Platform administrator. Manages coaches, members, subscriptions, recipes, and platform config via the admin portal (desktop + mobile). |

FMC is a managed service — coaches are employed by FMC, not independent users. There is no coach marketplace or self-service coach onboarding.

---

## Module Architecture

| Module | Service Area | Description |
|--------|-------------|-------------|
| **core** | 10 | Members, Coaches, Coach-Member matching |
| **coaching** | 20 | Programs, Sessions, Messages, Goals |
| **nutrition** | 30 | Meals (with AI analysis), Recipes |
| **progress** | 40 | Weight logs, Habit tracking, Metrics |
| **billing** | 50 | Subscriptions, Stripe webhook handling, B2B Partners |
| **tools** | 55 | Free public calculators (protein, meal plan, nutrient gap) |

---

## Protobuf Design

### File: `proto/fmc.proto`

```protobuf
syntax = "proto3";

package fmc;

option go_package = "./types/fmc";

import "l8common.proto";
import "api.proto";

// ──────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────

enum FmcMemberStatus {
  FMC_MEMBER_STATUS_UNSPECIFIED = 0;
  FMC_MEMBER_STATUS_TRIAL       = 1;
  FMC_MEMBER_STATUS_ACTIVE      = 2;
  FMC_MEMBER_STATUS_PAUSED      = 3;
  FMC_MEMBER_STATUS_CANCELLED   = 4;
  FMC_MEMBER_STATUS_CHURNED     = 5;
}

enum FmcCoachStatus {
  FMC_COACH_STATUS_UNSPECIFIED = 0;
  FMC_COACH_STATUS_ACTIVE      = 1;
  FMC_COACH_STATUS_INACTIVE    = 2;
  FMC_COACH_STATUS_ON_LEAVE    = 3;
}

enum FmcProgramType {
  FMC_PROGRAM_TYPE_UNSPECIFIED  = 0;
  FMC_PROGRAM_TYPE_WEIGHT_LOSS  = 1;
  FMC_PROGRAM_TYPE_GLP1         = 2;
  FMC_PROGRAM_TYPE_MAINTENANCE  = 3;
  FMC_PROGRAM_TYPE_EMOTIONAL    = 4;
}

enum FmcSessionType {
  FMC_SESSION_TYPE_UNSPECIFIED = 0;
  FMC_SESSION_TYPE_VIDEO_CALL  = 1;
  FMC_SESSION_TYPE_PHONE_CALL  = 2;
  FMC_SESSION_TYPE_TEXT        = 3;
}

enum FmcSessionStatus {
  FMC_SESSION_STATUS_UNSPECIFIED = 0;
  FMC_SESSION_STATUS_SCHEDULED   = 1;
  FMC_SESSION_STATUS_CONFIRMED   = 2;
  FMC_SESSION_STATUS_IN_PROGRESS = 3;
  FMC_SESSION_STATUS_COMPLETED   = 4;
  FMC_SESSION_STATUS_CANCELLED   = 5;
  FMC_SESSION_STATUS_NO_SHOW     = 6;
}

enum FmcGoalStatus {
  FMC_GOAL_STATUS_UNSPECIFIED = 0;
  FMC_GOAL_STATUS_ACTIVE      = 1;
  FMC_GOAL_STATUS_ACHIEVED    = 2;
  FMC_GOAL_STATUS_MISSED      = 3;
  FMC_GOAL_STATUS_REPLACED    = 4;
}

enum FmcMealType {
  FMC_MEAL_TYPE_UNSPECIFIED = 0;
  FMC_MEAL_TYPE_BREAKFAST   = 1;
  FMC_MEAL_TYPE_LUNCH       = 2;
  FMC_MEAL_TYPE_DINNER      = 3;
  FMC_MEAL_TYPE_SNACK       = 4;
}

enum FmcMealSource {
  FMC_MEAL_SOURCE_UNSPECIFIED = 0;
  FMC_MEAL_SOURCE_PHOTO       = 1;
  FMC_MEAL_SOURCE_TEXT        = 2;
}

enum FmcAiStatus {
  FMC_AI_STATUS_UNSPECIFIED = 0;
  FMC_AI_STATUS_PENDING     = 1;
  FMC_AI_STATUS_ANALYZING   = 2;
  FMC_AI_STATUS_COMPLETE    = 3;
  FMC_AI_STATUS_FAILED      = 4;
}

enum FmcRecipeCategory {
  FMC_RECIPE_CATEGORY_UNSPECIFIED = 0;
  FMC_RECIPE_CATEGORY_BREAKFAST   = 1;
  FMC_RECIPE_CATEGORY_LUNCH       = 2;
  FMC_RECIPE_CATEGORY_DINNER      = 3;
  FMC_RECIPE_CATEGORY_SNACK       = 4;
}

enum FmcDietaryTag {
  FMC_DIETARY_TAG_UNSPECIFIED  = 0;
  FMC_DIETARY_TAG_HIGH_PROTEIN = 1;
  FMC_DIETARY_TAG_HIGH_FIBER   = 2;
  FMC_DIETARY_TAG_LOW_CARB     = 3;
  FMC_DIETARY_TAG_VEGETARIAN   = 4;
  FMC_DIETARY_TAG_VEGAN        = 5;
  FMC_DIETARY_TAG_GLUTEN_FREE  = 6;
  FMC_DIETARY_TAG_DAIRY_FREE   = 7;
  FMC_DIETARY_TAG_GLP1_FRIENDLY = 8;
}

enum FmcSubscriptionStatus {
  FMC_SUBSCRIPTION_STATUS_UNSPECIFIED = 0;
  FMC_SUBSCRIPTION_STATUS_TRIAL       = 1;
  FMC_SUBSCRIPTION_STATUS_ACTIVE      = 2;
  FMC_SUBSCRIPTION_STATUS_PAUSED      = 3;
  FMC_SUBSCRIPTION_STATUS_CANCELLED   = 4;
  FMC_SUBSCRIPTION_STATUS_EXPIRED     = 5;
}

enum FmcSubscriptionPlan {
  FMC_SUBSCRIPTION_PLAN_UNSPECIFIED = 0;
  FMC_SUBSCRIPTION_PLAN_MONTHLY    = 1;
  FMC_SUBSCRIPTION_PLAN_QUARTERLY  = 2;
  FMC_SUBSCRIPTION_PLAN_ANNUAL     = 3;
}

enum FmcPartnerType {
  FMC_PARTNER_TYPE_UNSPECIFIED  = 0;
  FMC_PARTNER_TYPE_EMPLOYER     = 1;
  FMC_PARTNER_TYPE_MEDICAL      = 2;
  FMC_PARTNER_TYPE_TELEHEALTH   = 3;
}

enum FmcHabitCategory {
  FMC_HABIT_CATEGORY_UNSPECIFIED = 0;
  FMC_HABIT_CATEGORY_EATING      = 1;
  FMC_HABIT_CATEGORY_HYDRATION   = 2;
  FMC_HABIT_CATEGORY_SLEEP       = 3;
  FMC_HABIT_CATEGORY_MOVEMENT    = 4;
  FMC_HABIT_CATEGORY_MINDFULNESS = 5;
}

enum FmcMessageSender {
  FMC_MESSAGE_SENDER_UNSPECIFIED = 0;
  FMC_MESSAGE_SENDER_MEMBER      = 1;
  FMC_MESSAGE_SENDER_COACH       = 2;
  FMC_MESSAGE_SENDER_SYSTEM      = 3;
}

enum FmcWeightUnit {
  FMC_WEIGHT_UNIT_UNSPECIFIED = 0;
  FMC_WEIGHT_UNIT_KG          = 1;
  FMC_WEIGHT_UNIT_LBS         = 2;
}

enum FmcHeightUnit {
  FMC_HEIGHT_UNIT_UNSPECIFIED = 0;
  FMC_HEIGHT_UNIT_CM          = 1;
  FMC_HEIGHT_UNIT_IN          = 2;
}

enum FmcNotificationType {
  FMC_NOTIFICATION_TYPE_UNSPECIFIED       = 0;
  FMC_NOTIFICATION_TYPE_SESSION_REMINDER  = 1;
  FMC_NOTIFICATION_TYPE_MEAL_NUDGE        = 2;
  FMC_NOTIFICATION_TYPE_NEW_MESSAGE       = 3;
  FMC_NOTIFICATION_TYPE_GOAL_MILESTONE    = 4;
  FMC_NOTIFICATION_TYPE_COACH_CHECKIN     = 5;
  FMC_NOTIFICATION_TYPE_PAYMENT_FAILED    = 6;
  FMC_NOTIFICATION_TYPE_AI_ANALYSIS_READY = 7;
  FMC_NOTIFICATION_TYPE_NO_SHOW           = 8;
}

// ──────────────────────────────────────────────
// Child Types (no service, no List type)
// ──────────────────────────────────────────────

// Embedded in FmcMeal -- AI-detected nutritional breakdown
message MealNutrient {
  string nutrient_id  = 1;
  string name         = 2;
  int32  amount_mg    = 3;
  int32  daily_pct    = 4;
}

// Embedded in FmcRecipe
message RecipeIngredient {
  string ingredient_id = 1;
  string name          = 2;
  string quantity      = 3;
  string unit          = 4;
  int32  calories      = 5;
  int32  protein_g     = 6;
}

// Embedded in FmcRecipe
message RecipeStep {
  string step_id     = 1;
  int32  step_number = 2;
  string instruction = 3;
  int32  duration_min = 4;
}

// Embedded in FmcGoal -- checkpoint milestones
message GoalCheckpoint {
  string checkpoint_id = 1;
  int64  check_date    = 2;
  bool   completed     = 3;
  string notes         = 4;
}

// Embedded in FmcSubscription -- payment history
message PaymentRecord {
  string payment_id     = 1;
  int64  payment_date   = 2;
  l8common.Money amount = 3;
  string stripe_txn_id  = 5;
  bool   succeeded      = 6;
  string failure_reason = 7;
}

// ──────────────────────────────────────────────
// Prime Objects -- Module: core (Service Area 10)
// ──────────────────────────────────────────────

message FmcMember {
  string           member_id         = 1;
  string           first_name        = 2;
  string           last_name         = 3;
  string           email             = 4;
  string           phone             = 5;
  int64            date_of_birth     = 6;
  FmcMemberStatus  status            = 7;
  string           coach_id          = 8;
  string           program_id        = 9;
  string           user_id           = 10;
  int64            enrollment_date   = 11;
  int32            height_cm         = 12;
  int32            starting_weight_g = 13;
  int32            target_weight_g   = 14;
  string           timezone          = 15;
  string           dietary_prefs     = 16;
  string           medical_notes     = 17;
  bool             on_glp1           = 18;
  string           glp1_medication   = 19;
  string           partner_id        = 20;
  string           referral_source   = 21;
  FmcWeightUnit    weight_unit       = 22;
  FmcHeightUnit    height_unit       = 23;
  l8common.AuditInfo audit_info      = 30;
}

message FmcMemberList {
  repeated FmcMember list    = 1;
  l8api.L8MetaData   metadata = 2;
}

message FmcCoach {
  string          coach_id        = 1;
  string          first_name      = 2;
  string          last_name       = 3;
  string          email           = 4;
  string          phone           = 5;
  FmcCoachStatus  status          = 6;
  string          certification   = 7;
  string          specialization  = 8;
  string          bio             = 9;
  string          user_id         = 10;
  int32           max_clients     = 11;
  int32           active_clients  = 12;
  string          image_storage_path = 13;
  string          image_file_name    = 14;
  int64           image_file_size    = 15;
  l8common.AuditInfo audit_info   = 30;
}

message FmcCoachList {
  repeated FmcCoach list     = 1;
  l8api.L8MetaData  metadata = 2;
}

// ──────────────────────────────────────────────
// Prime Objects -- Module: coaching (Service Area 20)
// ──────────────────────────────────────────────

message FmcProgram {
  string          program_id    = 1;
  string          name          = 2;
  string          description   = 3;
  FmcProgramType  program_type  = 4;
  bool            is_active     = 5;
  int32           duration_weeks = 6;
  l8common.Money  price         = 7;
  string          features      = 8;
  l8common.AuditInfo audit_info = 30;
}

message FmcProgramList {
  repeated FmcProgram list    = 1;
  l8api.L8MetaData    metadata = 2;
}

message FmcSession {
  string            session_id      = 1;
  string            member_id       = 2;
  string            coach_id        = 3;
  FmcSessionType    session_type    = 4;
  FmcSessionStatus  status          = 5;
  int64             scheduled_time  = 6;
  int64             start_time      = 7;
  int64             end_time        = 8;
  int32             duration_min    = 9;
  string            coach_notes     = 10;
  string            member_notes    = 11;
  string            action_items    = 12;
  string            focus_topic     = 13;
  int32             week_number     = 14;
  l8common.AuditInfo audit_info     = 30;
}

message FmcSessionList {
  repeated FmcSession list    = 1;
  l8api.L8MetaData    metadata = 2;
}

message FmcMessage {
  string            message_id   = 1;
  string            member_id    = 2;
  string            coach_id     = 3;
  FmcMessageSender  sender       = 4;
  string            content      = 5;
  int64             sent_at      = 6;
  bool              is_read      = 7;
  int64             read_at      = 8;
  string            attachment_path = 9;
  string            attachment_file_name = 10;
  int64             attachment_file_size = 11;
  l8common.AuditInfo audit_info   = 30;
}

message FmcMessageList {
  repeated FmcMessage list    = 1;
  l8api.L8MetaData    metadata = 2;
}

message FmcGoal {
  string          goal_id      = 1;
  string          member_id    = 2;
  string          coach_id     = 3;
  string          session_id   = 4;
  string          title        = 5;
  string          description  = 6;
  FmcGoalStatus   status       = 7;
  int64           start_date   = 8;
  int64           target_date  = 9;
  int32           week_number  = 10;
  string          examples     = 11;
  repeated GoalCheckpoint checkpoints = 20;
  l8common.AuditInfo audit_info = 30;
}

message FmcGoalList {
  repeated FmcGoal list      = 1;
  l8api.L8MetaData  metadata = 2;
}

// ──────────────────────────────────────────────
// Prime Objects -- Module: nutrition (Service Area 30)
// ──────────────────────────────────────────────

message FmcMeal {
  string          meal_id          = 1;
  string          member_id        = 2;
  string          coach_id         = 27;
  FmcMealType     meal_type        = 3;
  FmcMealSource   source           = 4;
  string          description      = 5;
  string          image_storage_path = 6;
  string          image_file_name    = 25;
  int64           image_file_size    = 26;
  int64           logged_at        = 7;
  int32           calories         = 8;
  int32           protein_g        = 9;
  int32           fiber_g          = 10;
  int32           carbs_g          = 11;
  int32           fat_g            = 12;
  int32           satiety_score    = 13;
  string          ai_feedback      = 14;
  string          ai_suggestions   = 15;
  int32           confidence_pct   = 16;
  FmcAiStatus     ai_status        = 17;
  string          ai_error         = 18;
  repeated MealNutrient nutrients  = 20;
  l8common.AuditInfo audit_info    = 30;
}

message FmcMealList {
  repeated FmcMeal list      = 1;
  l8api.L8MetaData  metadata = 2;
}

message FmcRecipe {
  string               recipe_id      = 1;
  string               name           = 2;
  string               description    = 3;
  FmcRecipeCategory    category       = 4;
  int32                prep_time_min  = 5;
  int32                cook_time_min  = 6;
  int32                servings       = 7;
  int32                calories       = 8;
  int32                protein_g      = 9;
  int32                fiber_g        = 10;
  int32                carbs_g        = 11;
  int32                fat_g          = 12;
  string               image_storage_path = 13;
  string               image_file_name    = 22;
  int64                image_file_size    = 23;
  string               contributed_by = 14;
  bool                 is_validated   = 15;
  bool                 is_published   = 16;
  repeated FmcDietaryTag dietary_tags = 17;
  repeated RecipeIngredient ingredients = 20;
  repeated RecipeStep steps           = 21;
  l8common.AuditInfo   audit_info     = 30;
}

message FmcRecipeList {
  repeated FmcRecipe list     = 1;
  l8api.L8MetaData   metadata = 2;
}

// ──────────────────────────────────────────────
// Prime Objects -- Module: progress (Service Area 40)
// ──────────────────────────────────────────────

message FmcWeightLog {
  string           log_id       = 1;
  string           member_id    = 2;
  string           coach_id     = 10;
  int64            log_date     = 3;
  int32            weight_g     = 4;
  string           notes        = 5;
  string           image_storage_path = 6;
  string           image_file_name    = 8;
  int64            image_file_size    = 9;
  l8common.AuditInfo audit_info = 30;
}

message FmcWeightLogList {
  repeated FmcWeightLog list    = 1;
  l8api.L8MetaData      metadata = 2;
}

message FmcHabitLog {
  string             log_id       = 1;
  string             member_id    = 2;
  string             coach_id     = 9;
  int64              log_date     = 3;
  string             habit_name   = 4;
  FmcHabitCategory   category     = 5;
  bool               completed    = 6;
  string             notes        = 7;
  int32              streak_days  = 8;
  l8common.AuditInfo audit_info   = 30;
}

message FmcHabitLogList {
  repeated FmcHabitLog list    = 1;
  l8api.L8MetaData     metadata = 2;
}

// ──────────────────────────────────────────────
// Prime Objects -- Module: billing (Service Area 50)
// ──────────────────────────────────────────────

message FmcSubscription {
  string                  subscription_id = 1;
  string                  member_id       = 2;
  FmcSubscriptionPlan     plan            = 3;
  FmcSubscriptionStatus   status          = 4;
  int64                   start_date      = 5;
  int64                   end_date        = 6;
  int64                   trial_end_date  = 7;
  int64                   next_billing    = 8;
  l8common.Money          price           = 9;
  string                  stripe_customer_id = 11;
  string                  stripe_sub_id   = 12;
  int64                   paused_at       = 13;
  int64                   resume_at       = 14;
  string                  cancel_reason   = 15;
  repeated PaymentRecord  payments        = 20;
  l8common.AuditInfo      audit_info      = 30;
}

message FmcSubscriptionList {
  repeated FmcSubscription list    = 1;
  l8api.L8MetaData          metadata = 2;
}

message FmcPartner {
  string           partner_id    = 1;
  string           name          = 2;
  FmcPartnerType   partner_type  = 3;
  string           contact_name  = 4;
  string           contact_email = 5;
  string           contact_phone = 6;
  bool             is_active     = 7;
  string           contract_id   = 8;
  int64            start_date    = 9;
  int32            member_count  = 10;
  string           notes         = 11;
  l8common.AuditInfo audit_info  = 30;
}

message FmcPartnerList {
  repeated FmcPartner list    = 1;
  l8api.L8MetaData    metadata = 2;
}

// ──────────────────────────────────────────────
// Request/Response types for tools and webhooks
// ──────────────────────────────────────────────

// FmcToolRequest -- stateless calculator input
message FmcToolRequest {
  string tool_name    = 1;
  string input_json   = 2;
}

message FmcToolResponse {
  string tool_name    = 1;
  string output_json  = 2;
  bool   success      = 3;
  string error        = 4;
}

message FmcToolResponseList {
  repeated FmcToolResponse list = 1;
  l8api.L8MetaData metadata     = 2;
}
```

### Protobuf Design Notes

- All enums have `UNSPECIFIED = 0` zero value per `proto-enum-zero-value.md`
- All list types use `repeated X list = 1` + `l8api.L8MetaData metadata = 2` per `proto-list-convention.md`
- Child types (`MealNutrient`, `RecipeIngredient`, `RecipeStep`, `GoalCheckpoint`, `PaymentRecord`) are embedded as `repeated` fields — no separate services per `prime-object-references.md`
- Cross-references between Prime Objects use ID string fields only (e.g., `coach_id`, `member_id`)
- File attachments use `storage_path` + `file_name` + `file_size` fields per `file-upload-pattern.md`
- `l8common.AuditInfo audit_info = 30` on all Prime Objects
- `FmcAiStatus` enum tracks async AI analysis state on `FmcMeal`
- `FmcWeightUnit`/`FmcHeightUnit` enums on `FmcMember` for unit preferences (storage always in metric)
- `FmcNotificationType` enum defines all notification categories for l8notify integration
- `coach_id` on `FmcMeal`, `FmcWeightLog`, `FmcHabitLog` is auto-populated by ServiceCallback from the member's assigned coach — enables coach deny-rule scoping via `coachId!=${userId}`
- `read_at` field on `FmcMessage` supports read receipt tracking
- `failure_reason` field on `PaymentRecord` captures Stripe payment failure details

---

## Service Design

### Module: core (Service Area 10)

| Service Directory | ServiceName | ServiceArea | Model | Primary Key |
|-------------------|-------------|-------------|-------|-------------|
| `fmc/core/members/` | `Member` | 10 | `FmcMember` | `memberId` |
| `fmc/core/coaches/` | `Coach` | 10 | `FmcCoach` | `coachId` |

### Module: coaching (Service Area 20)

| Service Directory | ServiceName | ServiceArea | Model | Primary Key |
|-------------------|-------------|-------------|-------|-------------|
| `fmc/coaching/programs/` | `Program` | 20 | `FmcProgram` | `programId` |
| `fmc/coaching/sessions/` | `Session` | 20 | `FmcSession` | `sessionId` |
| `fmc/coaching/messages/` | `Message` | 20 | `FmcMessage` | `messageId` |
| `fmc/coaching/goals/` | `Goal` | 20 | `FmcGoal` | `goalId` |

### Module: nutrition (Service Area 30)

| Service Directory | ServiceName | ServiceArea | Model | Primary Key |
|-------------------|-------------|-------------|-------|-------------|
| `fmc/nutrition/meals/` | `Meal` | 30 | `FmcMeal` | `mealId` |
| `fmc/nutrition/recipes/` | `Recipe` | 30 | `FmcRecipe` | `recipeId` |

### Module: progress (Service Area 40)

| Service Directory | ServiceName | ServiceArea | Model | Primary Key |
|-------------------|-------------|-------------|-------|-------------|
| `fmc/progress/weightlogs/` | `WeightLog` | 40 | `FmcWeightLog` | `logId` |
| `fmc/progress/habitlogs/` | `HabitLog` | 40 | `FmcHabitLog` | `logId` |

### Module: billing (Service Area 50)

| Service Directory | ServiceName | ServiceArea | Model | Primary Key |
|-------------------|-------------|-------------|-------|-------------|
| `fmc/billing/subscriptions/` | `Subscript` | 50 | `FmcSubscription` | `subscriptionId` |
| `fmc/billing/partners/` | `Partner` | 50 | `FmcPartner` | `partnerId` |
| `fmc/billing/stripewebhook/` | `StripeWH` | 50 | (webhook handler) | N/A |

### AI Integration (Service Area 30)

| Service Directory | ServiceName | ServiceArea | Model | Primary Key |
|-------------------|-------------|-------------|-------|-------------|
| `fmc/nutrition/mealai/` | `MealAI` | 30 | (request/response) | N/A |

### Free Tools (Service Area 55, public)

| Service Directory | ServiceName | ServiceArea | Model | Primary Key |
|-------------------|-------------|-------------|-------|-------------|
| `fmc/tools/` | `FmcTool` | 55 | `FmcToolResponse` | N/A |

**ServiceName constraint:** All ServiceName values are 10 characters or less per `maintainability.md`.

### ServiceCallback Requirements

Each service callback must:
1. Auto-generate primary key on POST: `common.GenerateID(&entity.PrimaryKeyField)` per `maintainability.md`
2. Validate required fields per entity

**Key validation rules:**

| Entity | Required Fields |
|--------|----------------|
| `FmcMember` | `firstName`, `lastName`, `email` |
| `FmcCoach` | `firstName`, `lastName`, `email`, `certification` |
| `FmcProgram` | `name`, `programType` |
| `FmcSession` | `memberId`, `coachId`, `sessionType`, `scheduledTime` |
| `FmcMessage` | `memberId`, `coachId`, `sender`, `content` |
| `FmcGoal` | `memberId`, `coachId`, `title` |
| `FmcMeal` | `memberId`, `mealType` |
| `FmcRecipe` | `name`, `category` |
| `FmcWeightLog` | `memberId`, `logDate`, `weightG` |
| `FmcHabitLog` | `memberId`, `logDate`, `habitName` |
| `FmcSubscription` | `memberId`, `plan` |
| `FmcPartner` | `name`, `partnerType` |

**Auto-populated fields (ServiceCallback Before/POST):**
- `FmcMeal.coachId`: Looked up from `FmcMember.coachId` using `meal.MemberId`
- `FmcWeightLog.coachId`: Looked up from `FmcMember.coachId` using `log.MemberId`
- `FmcHabitLog.coachId`: Looked up from `FmcMember.coachId` using `log.MemberId`
- `FmcMember.userId`: Set to `member.Email` (following l8physio pattern)
- `FmcCoach.userId`: Set to `coach.Email` (following l8physio pattern)

**Immutability rules:**
- `FmcMessage`: Immutable after creation (reject PUT). Read receipts use PATCH to update only `isRead` and `readAt` fields. All other fields are protected.
- `FmcWeightLog`: `memberId` and `logDate` are immutable on PUT.
- `FmcMeal`: `memberId` is immutable on PUT.

---

## Coach-Member Matching

### Automatic Assignment on Member POST

When a new `FmcMember` is POSTed, `FmcMemberServiceCallback.After()` automatically assigns a coach:

1. Query all coaches with `status = ACTIVE`
2. Filter coaches whose `specialization` matches the member's `programType`:
   - `WEIGHT_LOSS` → any specialization
   - `GLP1` → "GLP-1 Nutrition"
   - `EMOTIONAL` → "Emotional Eating"
   - `MAINTENANCE` → "Weight Management"
3. Among matching coaches, select the one with the lowest `active_clients / max_clients` ratio
4. If the selected coach's `active_clients >= max_clients`, reject the member creation with an error ("No available coaches — all at capacity")
5. Set `member.coachId` to the selected coach, increment the coach's `active_clients` via PUT

### Coach Switching

When a PUT on `FmcMember` changes `coachId`:
1. `FmcMemberServiceCallback.Before()` detects the coachId change (compare old vs new)
2. Validate the new coach has capacity (`active_clients < max_clients`)
3. In `After()`: decrement old coach's `active_clients`, increment new coach's `active_clients`

### Admin Override

Admins can manually assign/reassign coaches via the admin portal by editing the member's `coachId` field. The same capacity check applies.

---

## Real-Time Messaging Design

### WebSocket Infrastructure

FMC leverages the built-in `l8web.WebSocketManager` for real-time push:

1. **Connection**: Client connects to `/ws` with bearer token in the initial HTTP upgrade request. The `WebSocketManager` authenticates via `ISecurityProvider` and registers the connection by user ID.

2. **Auto-notifications**: When any service's cache performs a Post/Put/Patch/Delete, the framework automatically creates an `L8NotificationSet` containing the affected type name, action, and element data. `WsNotifyService` broadcasts this to all connected WebSocket clients.

3. **Message flow**:
   - Member sends message → POST to `/fmc/20/Message` → server saves `FmcMessage` → cache triggers `L8NotificationSet` → WebSocket pushes to coach's connection
   - Coach sends message → same flow, WebSocket pushes to member's connection
   - Both parties see the new message appear instantly without polling

### Read Receipts

When a user opens a conversation, the client sends a PATCH (not PUT — FmcMessage rejects PUT) to mark messages as read:
- Sets `isRead = true` and `readAt = now()` on all unread messages in the conversation
- The FmcMessageServiceCallback.Before() allows PATCH only for `isRead` and `readAt` fields, rejecting changes to any other field
- The cache update triggers a WebSocket notification to the other party, updating the read status indicator in real-time

### Unread Count

The member portal and coach portal track unread message count:
- On initial load: `select * from FmcMessage where coachId=${userId} and isRead=false` (for coaches) or `where memberId=${userId} and isRead=false` (for members)
- WebSocket notifications for new FmcMessage arrivals increment the count
- WebSocket notifications for read-status updates decrement the count
- Displayed as a badge on the Messages nav item

### Chat UI Design

**Coach Portal (Desktop):**
- Messages service view shows a split-pane layout: member list on the left, conversation thread on the right
- Conversation thread renders messages in a chat bubble format (coach messages right-aligned, member messages left-aligned)
- Text input at the bottom with send button
- File attachment via FileStore upload (meal photos shared by member)
- Real-time updates via WebSocket — no manual refresh needed

**Member Portal:**
- Single-thread view (member has exactly one coach)
- Same chat bubble format
- Photo upload button for sharing meal photos inline
- WebSocket connection maintained while app is open

**Mobile (both portals):**
- Full-screen conversation view
- Swipe-to-reply gesture
- Push notification stub for when WebSocket is disconnected (future: integrate with FCM/APNs)

---

## AI Meal Analysis Service

### Architecture

The `MealAI` service follows `l8agent` patterns for LLM integration:

1. **Conversation persistence**: Each meal analysis creates an `L8AgentConversation` to maintain analysis context. The conversation stores the system prompt (nutrition analysis instructions) and the meal data.

2. **Tool loop**: The LLM is provided with tools to:
   - Look up the member's dietary preferences and goals
   - Look up the member's recent meal history (last 7 days) for pattern detection
   - Check if the member is on GLP-1 medication (triggers specialized prompts)

3. **Data masking**: Per l8agent patterns, member PII (name, email, phone) is masked before sending to the LLM. Only dietary data and anonymous identifiers are included.

### Meal Analysis Pipeline

```
Member logs meal (photo or text)
    ↓
POST /fmc/30/Meal
    ↓
FmcMealServiceCallback.After(POST):
    1. Set meal.aiStatus = PENDING
    2. Goroutine: call MealAI service asynchronously
    ↓
MealAI service:
    1. Set meal.aiStatus = ANALYZING (PUT)
    2. If photo: read image from FileStore → base64 encode
    3. Build LLM prompt with:
       - System: "You are a nutrition analysis AI..."
       - Member context: dietary prefs, GLP-1 status, goals
       - Recent meals (last 7 days) for pattern context
       - The meal image or text description
    4. Call LLM via l8agent orchestrator
    5. Parse structured response:
       - calories, protein_g, fiber_g, carbs_g, fat_g
       - satiety_score (1-10)
       - ai_feedback (1-2 sentence summary)
       - ai_suggestions (actionable improvement)
       - confidence_pct (0-100)
       - nutrients[] (micronutrient breakdown)
    6. PUT analysis results back onto FmcMeal
    7. Set meal.aiStatus = COMPLETE
    ↓
WebSocket notification pushes updated meal to member
    ↓
Member sees "Analyzing..." → nutritional breakdown appears
```

### Error Handling

- If LLM call fails: set `aiStatus = FAILED`, `aiError = <error message>`
- Retry logic: up to 3 retries with exponential backoff (1s, 3s, 9s)
- If all retries fail: notification sent to member ("AI analysis unavailable, your coach will review manually")
- Coach portal shows failed analyses with a "Retry Analysis" button

### GLP-1-Specific Prompts

When `member.onGlp1 = true`:
- **Protein target alerts**: If meal protein < 30g, AI feedback includes: "This meal is below the 30g protein target recommended for GLP-1 users"
- **Minimum calorie warnings**: If daily total < 1200 kcal, AI flags: "Your daily intake is below 1200 calories — important to maintain adequate nutrition on GLP-1 medication"
- **Nutrient gap detection**: AI checks for common GLP-1 deficiency risks (B12, iron, fiber) and suggests foods to address gaps
- System prompt variation: "The member is on {glp1_medication}. Prioritize protein adequacy (30g+ per meal), hydration reminders, and nutrient density over calorie restriction."

---

## Notification System

### l8notify Integration

FMC integrates with `l8notify` for multi-channel notification delivery.

#### Notification Channels

| Channel | Implementation | Use Cases |
|---------|---------------|-----------|
| **In-app (WebSocket)** | Built-in via `l8web.WsNotifyService` | All real-time notifications |
| **Email** | `l8notify.EmailSender` via SMTP config | Session reminders, payment failures, weekly summaries |
| **Push (future)** | Custom `l8notify.Sender` via FCM/APNs | Mobile notifications when WebSocket is disconnected |

#### Notification Types and Triggers

| Type | Trigger | Channels | Timing |
|------|---------|----------|--------|
| `SESSION_REMINDER` | Scheduled session approaching | In-app, Email | 24h before, 1h before |
| `MEAL_NUDGE` | No meal logged by midday/evening | In-app | 12:00 PM if no breakfast/lunch; 6:00 PM if no dinner |
| `NEW_MESSAGE` | New FmcMessage created | In-app, Push | Immediate |
| `GOAL_MILESTONE` | Goal status changed to ACHIEVED | In-app | Immediate |
| `COACH_CHECKIN` | Mid-week check-in schedule | In-app, Email | Wednesday if no coach message since Monday |
| `PAYMENT_FAILED` | Stripe `invoice.payment_failed` webhook | In-app, Email | Immediate |
| `AI_ANALYSIS_READY` | Meal AI analysis completed | In-app | Immediate |
| `NO_SHOW` | Session status changed to NO_SHOW | In-app, Email | Immediate (to admin) |

#### Escalation Rules

Using `l8notify.EscalationStep` scheduler:

1. **Session no-show**:
   - Step 1 (0 min): Notify coach and member "Session missed"
   - Step 2 (5 min): If no response, notify admin
   - Step 3 (24h): If session not rescheduled, flag member for review

2. **Payment failure**:
   - Step 1 (0 min): Notify member "Payment failed — please update payment method"
   - Step 2 (3 days): Reminder notification
   - Step 3 (7 days): Notify coach "Member {name} has unpaid invoice"
   - Step 4 (14 days): Auto-pause subscription, notify admin

3. **Member inactivity (no meal logged in 3 days)**:
   - Step 1 (3 days): Nudge notification to member
   - Step 2 (5 days): Notify coach "Member {name} hasn't logged meals in 5 days"
   - Step 3 (7 days): Notify admin for review

#### Implementation

Notification dispatch is handled in ServiceCallback `After()` methods:
- `FmcSessionServiceCallback.After(PUT)`: Check status transitions → SESSION_REMINDER, NO_SHOW
- `FmcMessageServiceCallback.After(POST)`: Trigger NEW_MESSAGE notification
- `FmcGoalServiceCallback.After(PUT)`: Check status = ACHIEVED → GOAL_MILESTONE
- `FmcMealServiceCallback.After(PUT)`: Check aiStatus = COMPLETE → AI_ANALYSIS_READY

Scheduled notifications (meal nudges, coach check-ins) run as background goroutines in the main process, checking conditions at the configured times.

---

## Stripe Payment Integration

### Webhook Handler Service

The `StripeWH` service (ServiceName: `StripeWH`, ServiceArea: 50) handles incoming Stripe webhook events.

#### Webhook Endpoint

- **Path**: `/fmc/50/StripeWH` (POST only)
- **Authentication**: Stripe signature verification using webhook signing secret (stored in security config credentials)
- **No bearer token**: Stripe webhooks are unauthenticated HTTP requests; the service validates using `stripe-signature` header

#### Subscription Lifecycle Flows

**Trial → Active:**
```
1. Member signs up → POST FmcSubscription (status=TRIAL, trial_end_date=now+7d)
2. Member enters payment method → Stripe creates customer + subscription (trial)
3. Trial ends → Stripe webhook: invoice.paid
4. StripeWH handler: PUT FmcSubscription (status=ACTIVE, next_billing=+30d)
5. Append PaymentRecord to subscription.payments
```

**Active → Paused:**
```
1. Member requests pause → PUT FmcSubscription (status=PAUSED, paused_at=now, resume_at=now+30d)
2. FmcSubscriptionServiceCallback.After(PUT): Call Stripe API to pause subscription
3. Max pause duration: 30 days. After 30 days, auto-resume or cancel.
```

**Paused → Active:**
```
1. Member requests resume (or auto-resume at resume_at) → PUT FmcSubscription (status=ACTIVE)
2. FmcSubscriptionServiceCallback.After(PUT): Call Stripe API to resume subscription
3. Clear paused_at and resume_at fields
```

**Active → Cancelled:**
```
1. Member requests cancellation → PUT FmcSubscription (status=CANCELLED, cancel_reason="...")
2. FmcSubscriptionServiceCallback.After(PUT): Call Stripe API to cancel subscription
3. FmcMemberServiceCallback: Update member status to CANCELLED
4. Decrement coach's active_clients
```

#### Stripe Webhook Events Handled

| Stripe Event | FMC Action |
|-------------|------------|
| `invoice.paid` | Append PaymentRecord (succeeded=true), update next_billing |
| `invoice.payment_failed` | Append PaymentRecord (succeeded=false, failure_reason), trigger PAYMENT_FAILED notification |
| `customer.subscription.deleted` | Set FmcSubscription status=CANCELLED, update FmcMember status=CHURNED |
| `customer.subscription.paused` | Set FmcSubscription status=PAUSED (if initiated from Stripe dashboard) |
| `customer.subscription.resumed` | Set FmcSubscription status=ACTIVE |

#### Stripe Configuration

Stripe API keys and webhook signing secret are stored in the security config credentials:
```json
"credentials": {
  "stripe": {
    "aside": "<stripe_secret_key>",
    "zside": "<webhook_signing_secret>"
  }
}
```

---

## Free Tools (Lead Generation)

### FmcTool Service

The `FmcTool` service (ServiceArea: 55) provides stateless calculator endpoints that require **no authentication**. These serve as the top-of-funnel lead generation mechanism, matching FitMate Coach's free tools page.

#### Endpoint

- **Path**: `POST /fmc/55/FmcTool`
- **Auth**: None (public endpoint, exempted from `ISecurityProvider`)
- **Request**: `FmcToolRequest` with `tool_name` and `input_json`
- **Response**: `FmcToolResponse` with `output_json`

#### Available Tools

**1. Protein Calculator**
```json
// Input
{ "weight_kg": 80, "age": 35, "activity_level": "moderate", "goal": "weight_loss", "on_glp1": true }

// Output
{ "daily_protein_g": 128, "per_meal_protein_g": 32, "explanation": "At 80kg with weight loss goals and GLP-1 medication, aim for 1.6g/kg body weight..." }
```

**2. Meal Plan Generator**
```json
// Input
{ "dietary_prefs": ["vegetarian"], "calorie_target": 1800, "meals_per_day": 4, "on_glp1": false }

// Output
{ "meal_plan": { "breakfast": {...}, "lunch": {...}, "dinner": {...}, "snack": {...} }, "total_calories": 1780, "total_protein_g": 95 }
```

**3. Nutrient Gap Checker**
```json
// Input
{ "medication": "Ozempic", "current_symptoms": ["fatigue", "hair_loss"] }

// Output
{ "at_risk_nutrients": ["B12", "Iron", "Zinc"], "recommendations": ["Add red meat or B12 supplement...", ...], "foods_to_add": ["spinach", "eggs", "fortified cereals"] }
```

#### Implementation

The `FmcToolServiceCallback` routes by `tool_name`:
- No database interaction — purely computational
- No user context needed — stateless
- Results are not persisted
- The public website embeds these tools with a CTA: "Get personalized coaching for $69/month"

---

## Unit Preferences

### Storage Convention

All measurements are stored in metric units internally:
- Weight: grams (`int32 weight_g`)
- Height: centimeters (`int32 height_cm`)

### Member Preference Fields

`FmcMember` includes:
- `weight_unit` (enum `FmcWeightUnit`): KG or LBS — controls how weight is displayed/collected in the member's UI
- `height_unit` (enum `FmcHeightUnit`): CM or IN — controls how height is displayed/collected

### Conversion Logic

Conversion utilities are implemented in both desktop and mobile JS:

```js
// Shared utility functions (added to layer8d-utils.js or project-specific utils)
function gramsToLbs(grams) { return Math.round(grams / 453.592 * 10) / 10; }
function lbsToGrams(lbs) { return Math.round(lbs * 453.592); }
function gramsToKg(grams) { return Math.round(grams / 10) / 100; }
function kgToGrams(kg) { return Math.round(kg * 1000); }
function cmToInches(cm) { return Math.round(cm / 2.54 * 10) / 10; }
function inchesToCm(inches) { return Math.round(inches * 2.54); }
```

### UI Behavior

- Member portal weight log form: display/collect in member's preferred unit, convert to grams before POST
- Coach portal weight log view: display in member's preferred unit (loaded from FmcMember record)
- Weight chart y-axis label: "Weight (kg)" or "Weight (lbs)" based on member preference
- Registration/onboarding form: unit preference selector with default based on locale

---

## Member Portal

### Overview

The member portal is the **primary product surface** — where members spend 90% of their time. It is a standalone web application following the l8physio boostapp pattern: a separate UI process (`fmc-member-web`) that serves member-specific pages and connects to the same backend vnet.

### Member Portal Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Today's summary: meals logged, goals, upcoming session, weight trend sparkline |
| **Log Meal** | Photo upload or text entry → AI analysis with "Analyzing..." state → nutritional breakdown |
| **Chat** | Real-time messaging with coach (WebSocket-powered) |
| **Goals** | Current weekly goals with checkpoint tracking |
| **Progress** | Weight chart (line graph), habit streak calendar, weekly summary |
| **Sessions** | Upcoming and past sessions, join link for video calls |
| **Recipes** | Browse coach-recommended and platform recipes |
| **Profile** | Personal info, dietary preferences, unit preferences, GLP-1 settings |

### Member Portal Architecture

The member portal is a separate web process (`fmc-member-web`) with its own `app.html`:
- **No sidebar navigation**: Instead, a bottom tab bar (mobile-first design) with tabs: Home, Log, Chat, Progress, Profile
- **No admin/coach data**: Member portal only shows the member's own data (enforced by security deny rules)
- **Shared backend**: Connects to the same vnet as the admin/coach portal — no separate services needed
- **Security scoping**: All data scoped to `memberId=${userId}` via security deny rules

### Directory Structure (Member Portal)

```
go/fmc/member-ui/
├── main.go           # Web server for member portal
├── build.sh
├── Dockerfile
└── web/
    ├── index.html    # Redirect to login
    ├── login.html    # Member login page
    ├── login.json    # apiPrefix: "/fmc", appTitle: "FitMate Coach"
    ├── app.html      # Member SPA shell (bottom tab bar, no sidebar)
    ├── l8ui/          # Submodule (reuses shared components)
    ├── css/
    │   └── member.css # Member-specific styles (tab bar, meal card, chat bubbles)
    └── js/
        ├── member-app.js        # App initialization, tab navigation
        ├── member-dashboard.js  # Dashboard with today's summary
        ├── member-meal-log.js   # Meal logging (photo + text)
        ├── member-chat.js       # Chat UI with WebSocket
        ├── member-progress.js   # Weight chart, habit calendar
        ├── member-profile.js    # Profile editing
        └── member-utils.js      # Unit conversion, shared helpers
```

### Member Portal UI Behavior

**Meal Logging Flow:**
1. Member taps "Log Meal" → camera/file picker opens
2. Member selects photo or types description, selects meal type (Breakfast/Lunch/Dinner/Snack)
3. POST to `/fmc/30/Meal` with image uploaded via FileStore
4. UI shows "Analyzing your meal..." with spinner
5. WebSocket notification arrives when `aiStatus = COMPLETE`
6. UI updates to show: calorie count, macro breakdown (protein/carbs/fat/fiber), satiety score, AI feedback text
7. If `aiStatus = FAILED`: show "Analysis unavailable — your coach will review"

**Chat Flow:**
1. Member opens Chat tab → loads recent messages via L8Query
2. WebSocket connection established → real-time message delivery
3. Member types and sends → POST to `/fmc/20/Message` → instant delivery to coach
4. Read receipts: when member opens chat, unread messages are marked read via PUT

---

## Project Directory Structure

```
fmc/
├── proto/
│   ├── fmc.proto
│   └── make-bindings.sh
├── go/
│   ├── go.mod
│   ├── go.sum
│   ├── vendor/
│   ├── build-all-images.sh
│   ├── run-local.sh
│   ├── types/
│   │   └── fmc/                         # Generated .pb.go files
│   ├── fmc/
│   │   ├── common/
│   │   │   └── defaults.go              # PREFIX = "/fmc/"
│   │   ├── core/
│   │   │   ├── members/
│   │   │   │   ├── FmcMemberService.go
│   │   │   │   └── FmcMemberServiceCallback.go
│   │   │   └── coaches/
│   │   │       ├── FmcCoachService.go
│   │   │       └── FmcCoachServiceCallback.go
│   │   ├── coaching/
│   │   │   ├── programs/
│   │   │   │   ├── FmcProgramService.go
│   │   │   │   └── FmcProgramServiceCallback.go
│   │   │   ├── sessions/
│   │   │   │   ├── FmcSessionService.go
│   │   │   │   └── FmcSessionServiceCallback.go
│   │   │   ├── messages/
│   │   │   │   ├── FmcMessageService.go
│   │   │   │   └── FmcMessageServiceCallback.go
│   │   │   └── goals/
│   │   │       ├── FmcGoalService.go
│   │   │       └── FmcGoalServiceCallback.go
│   │   ├── nutrition/
│   │   │   ├── meals/
│   │   │   │   ├── FmcMealService.go
│   │   │   │   └── FmcMealServiceCallback.go
│   │   │   ├── recipes/
│   │   │   │   ├── FmcRecipeService.go
│   │   │   │   └── FmcRecipeServiceCallback.go
│   │   │   └── mealai/
│   │   │       └── FmcMealAIService.go
│   │   ├── progress/
│   │   │   ├── weightlogs/
│   │   │   │   ├── FmcWeightLogService.go
│   │   │   │   └── FmcWeightLogServiceCallback.go
│   │   │   └── habitlogs/
│   │   │       ├── FmcHabitLogService.go
│   │   │       └── FmcHabitLogServiceCallback.go
│   │   ├── billing/
│   │   │   ├── subscriptions/
│   │   │   │   ├── FmcSubscriptionService.go
│   │   │   │   └── FmcSubscriptionServiceCallback.go
│   │   │   ├── partners/
│   │   │   │   ├── FmcPartnerService.go
│   │   │   │   └── FmcPartnerServiceCallback.go
│   │   │   └── stripewebhook/
│   │   │       └── FmcStripeWebhookService.go
│   │   ├── tools/
│   │   │   └── FmcToolService.go
│   │   ├── services/
│   │   │   └── activate.go
│   │   ├── vnet/
│   │   │   ├── main.go
│   │   │   ├── build.sh
│   │   │   └── Dockerfile
│   │   ├── main/
│   │   │   ├── main.go
│   │   │   ├── build.sh
│   │   │   └── Dockerfile
│   │   ├── ui/
│   │   │   ├── main.go
│   │   │   ├── build.sh
│   │   │   ├── Dockerfile
│   │   │   └── web/
│   │   │       ├── index.html
│   │   │       ├── login.html
│   │   │       ├── login.json
│   │   │       ├── app.html
│   │   │       ├── l8ui/                # Submodule
│   │   │       ├── css/
│   │   │       │   ├── base-core.css
│   │   │       │   └── responsive.css
│   │   │       ├── js/
│   │   │       │   ├── sections.js
│   │   │       │   ├── app.js
│   │   │       │   ├── reference-registry-core.js
│   │   │       │   ├── reference-registry-coaching.js
│   │   │       │   ├── reference-registry-nutrition.js
│   │   │       │   ├── reference-registry-progress.js
│   │   │       │   └── reference-registry-billing.js
│   │   │       ├── sections/
│   │   │       │   ├── dashboard.html
│   │   │       │   ├── core.html
│   │   │       │   ├── coaching.html
│   │   │       │   ├── nutrition.html
│   │   │       │   ├── progress.html
│   │   │       │   ├── billing.html
│   │   │       │   └── system.html
│   │   │       ├── fmc-ui/
│   │   │       │   ├── core/
│   │   │       │   │   ├── core-config.js
│   │   │       │   │   ├── core-enums.js
│   │   │       │   │   ├── core-columns.js
│   │   │       │   │   ├── core-forms.js
│   │   │       │   │   └── core-init.js
│   │   │       │   ├── coaching/
│   │   │       │   │   ├── coaching-config.js
│   │   │       │   │   ├── coaching-enums.js
│   │   │       │   │   ├── coaching-columns.js
│   │   │       │   │   ├── coaching-forms.js
│   │   │       │   │   └── coaching-init.js
│   │   │       │   ├── nutrition/
│   │   │       │   │   ├── nutrition-config.js
│   │   │       │   │   ├── nutrition-enums.js
│   │   │       │   │   ├── nutrition-columns.js
│   │   │       │   │   ├── nutrition-forms.js
│   │   │       │   │   └── nutrition-init.js
│   │   │       │   ├── progress/
│   │   │       │   │   ├── progress-config.js
│   │   │       │   │   ├── progress-enums.js
│   │   │       │   │   ├── progress-columns.js
│   │   │       │   │   ├── progress-forms.js
│   │   │       │   │   └── progress-init.js
│   │   │       │   └── billing/
│   │   │       │       ├── billing-config.js
│   │   │       │       ├── billing-enums.js
│   │   │       │       ├── billing-columns.js
│   │   │       │       ├── billing-forms.js
│   │   │       │       └── billing-init.js
│   │   │       └── m/
│   │   │           ├── app.html
│   │   │           └── js/
│   │   │               ├── app-core.js
│   │   │               ├── core/
│   │   │               │   ├── core-enums.js
│   │   │               │   ├── core-columns.js
│   │   │               │   ├── core-forms.js
│   │   │               │   └── core-index.js
│   │   │               ├── coaching/
│   │   │               │   ├── coaching-enums.js
│   │   │               │   ├── coaching-columns.js
│   │   │               │   ├── coaching-forms.js
│   │   │               │   └── coaching-index.js
│   │   │               ├── nutrition/
│   │   │               │   ├── nutrition-enums.js
│   │   │               │   ├── nutrition-columns.js
│   │   │               │   ├── nutrition-forms.js
│   │   │               │   └── nutrition-index.js
│   │   │               ├── progress/
│   │   │               │   ├── progress-enums.js
│   │   │               │   ├── progress-columns.js
│   │   │               │   ├── progress-forms.js
│   │   │               │   └── progress-index.js
│   │   │               └── billing/
│   │   │                   ├── billing-enums.js
│   │   │                   ├── billing-columns.js
│   │   │                   ├── billing-forms.js
│   │   │                   └── billing-index.js
│   │   └── member-ui/
│   │       ├── main.go
│   │       ├── build.sh
│   │       ├── Dockerfile
│   │       └── web/
│   │           ├── index.html
│   │           ├── login.html
│   │           ├── login.json
│   │           ├── app.html
│   │           ├── l8ui/              # Submodule
│   │           ├── css/
│   │           │   └── member.css
│   │           └── js/
│   │               ├── member-app.js
│   │               ├── member-dashboard.js
│   │               ├── member-meal-log.js
│   │               ├── member-chat.js
│   │               ├── member-progress.js
│   │               ├── member-profile.js
│   │               └── member-utils.js
│   ├── tests/
│   │   └── mocks/
│   │       ├── cmd/
│   │       │   └── main.go
│   │       ├── data.go
│   │       ├── store.go
│   │       ├── main_phases.go
│   │       ├── gen_core.go
│   │       ├── gen_members.go
│   │       ├── gen_coaching.go
│   │       ├── gen_nutrition.go
│   │       └── gen_progress.go
│   └── secure/
│       └── plugin/
│           └── fmc/
│               └── fmc.json
├── k8s/
│   ├── deploy.sh
│   ├── undeploy.sh
│   ├── fmc.yaml
│   ├── fmc-web.yaml
│   ├── fmc-member-web.yaml
│   └── fmc-vnet.yaml
└── plans/
    └── fmc-prd.md
```

---

## UI Design

### Desktop (Admin/Coach Portal)

The desktop UI is for Coaches and Admins to manage members, sessions, and the platform.

#### Sidebar Navigation

| Section | Icon | Description |
|---------|------|-------------|
| Dashboard | Home | KPI widgets: active members, sessions this week, meal logs today, avg member progress |
| Core | People | Members table, Coaches table |
| Coaching | Calendar | Programs, Sessions, Messages, Goals |
| Nutrition | Fork/Knife | Meals (with AI insights), Recipes |
| Progress | Chart | Weight Logs, Habit Logs |
| Billing | Dollar | Subscriptions, Partners |
| System | Gear | Health, Security, Logs, Modules, Data Import |

#### Module Configurations

**Core Module:**
```js
Layer8ModuleConfigFactory.create({
    namespace: 'FmcCore',
    modules: {
        'people': mod('People', 'icon', [
            svc('members', 'Members', 'icon', '/10/Member', 'FmcMember'),
            svc('coaches', 'Coaches', 'icon', '/10/Coach', 'FmcCoach')
        ])
    },
    submodules: ['FmcCorePeople']
});
```

**Coaching Module:**
```js
Layer8ModuleConfigFactory.create({
    namespace: 'FmcCoaching',
    modules: {
        'management': mod('Management', 'icon', [
            svc('programs', 'Programs', 'icon', '/20/Program', 'FmcProgram'),
            svc('sessions', 'Sessions', 'icon', '/20/Session', 'FmcSession'),
            svc('messages', 'Messages', 'icon', '/20/Message', 'FmcMessage'),
            svc('goals', 'Goals', 'icon', '/20/Goal', 'FmcGoal')
        ])
    },
    submodules: ['FmcCoachingMgmt']
});
```

**Nutrition Module:**
```js
Layer8ModuleConfigFactory.create({
    namespace: 'FmcNutrition',
    modules: {
        'food': mod('Food', 'icon', [
            svc('meals', 'Meals', 'icon', '/30/Meal', 'FmcMeal'),
            svc('recipes', 'Recipes', 'icon', '/30/Recipe', 'FmcRecipe')
        ])
    },
    submodules: ['FmcNutritionFood']
});
```

**Progress Module:**
```js
Layer8ModuleConfigFactory.create({
    namespace: 'FmcProgress',
    modules: {
        'tracking': mod('Tracking', 'icon', [
            svc('weight', 'Weight', 'icon', '/40/WeightLog', 'FmcWeightLog'),
            svc('habits', 'Habits', 'icon', '/40/HabitLog', 'FmcHabitLog')
        ])
    },
    submodules: ['FmcProgressTrack']
});
```

**Billing Module:**
```js
Layer8ModuleConfigFactory.create({
    namespace: 'FmcBilling',
    modules: {
        'finance': mod('Finance', 'icon', [
            svc('subscriptions', 'Subs', 'icon', '/50/Subscript', 'FmcSubscription'),
            svc('partners', 'Partners', 'icon', '/50/Partner', 'FmcPartner')
        ])
    },
    submodules: ['FmcBillingFin']
});
```

#### View Types per Service

| Service | Views | Notes |
|---------|-------|-------|
| Members | table, chart | Chart: member status distribution |
| Coaches | table | |
| Programs | table | |
| Sessions | table, calendar, kanban | Calendar: by scheduled_time. Kanban: by status |
| Messages | table, timeline | Timeline: by sent_at |
| Goals | table, kanban | Kanban: by status |
| Meals | table, chart | Chart: meals by type over time |
| Recipes | table | |
| Weight Logs | table, chart | Chart: weight over time per member |
| Habit Logs | table, chart | Chart: completion rate by category |
| Subscriptions | table, chart | Chart: subscription status distribution |
| Partners | table | |

#### Immutability UI

Per `immutability-ui-alignment.md`:
- **FmcMessage**: Table set to read-only mode (no edit/delete). Detail popups render all fields as display-only.
- **FmcWeightLog**: `memberId` and `logDate` fields marked `readOnly: true` in edit forms.

#### Dashboard Widgets

| Widget | Metric | Source |
|--------|--------|--------|
| Active Members | Count of members with status=ACTIVE | `select * from FmcMember where status=2` |
| Sessions This Week | Count of sessions scheduled this week | `select * from FmcSession where scheduledTime>=X` |
| Meals Logged Today | Count of meals logged today | `select * from FmcMeal where loggedAt>=X` |
| Avg Satiety Score | Average satiety score across meals | Computed from FmcMeal data |
| Goal Achievement | % of goals with status=ACHIEVED this month | Computed from FmcGoal data |
| Trial Conversions | % of trial members converting to active | Computed from FmcSubscription data |
| Revenue MRR | Monthly recurring revenue | Computed from FmcSubscription data |
| Coach Capacity | Active clients vs max clients per coach | Computed from FmcCoach data |

### Mobile (Admin/Coach)

Mobile follows the same module structure with card-based navigation per `adding-module-mobile.md`.

**Nav Config:**
```js
LAYER8M_NAV_CONFIG.modules = [
    { key: 'core', label: 'Core', icon: 'core', hasSubModules: true },
    { key: 'coaching', label: 'Coaching', icon: 'coaching', hasSubModules: true },
    { key: 'nutrition', label: 'Nutrition', icon: 'nutrition', hasSubModules: true },
    { key: 'progress', label: 'Progress', icon: 'progress', hasSubModules: true },
    { key: 'billing', label: 'Billing', icon: 'billing', hasSubModules: true }
];
```

Each module's mobile config follows the pattern from `adding-module-mobile.md` with `primary: true` and `secondary: true` on key columns for card display.

### Desktop/Mobile Parity

Per `mobile-rules.md`, every desktop section has a corresponding mobile section. Both platforms share:
- Enum definitions (same IIFE files, shared between desktop and mobile)
- Column definitions (mobile adds `primary`/`secondary`)
- Form definitions (identical schema)
- Reference registries

---

## Reference Registries

### Desktop (`reference-registry-*.js`)

```js
// reference-registry-core.js
Layer8DReferenceRegistry.register({
    FmcMember: { idColumn: 'memberId', displayColumn: 'lastName',
        selectColumns: ['memberId', 'firstName', 'lastName'],
        displayLabel: 'Member',
        displayFormat: (item) => `${item.lastName}, ${item.firstName}` },
    FmcCoach: { idColumn: 'coachId', displayColumn: 'lastName',
        selectColumns: ['coachId', 'firstName', 'lastName'],
        displayLabel: 'Coach',
        displayFormat: (item) => `${item.lastName}, ${item.firstName}` }
});

// reference-registry-coaching.js
Layer8DReferenceRegistry.register({
    FmcProgram: { idColumn: 'programId', displayColumn: 'name', displayLabel: 'Program' },
    FmcSession: { idColumn: 'sessionId', displayColumn: 'focusTopic', displayLabel: 'Session' },
    FmcGoal: { idColumn: 'goalId', displayColumn: 'title', displayLabel: 'Goal' }
});

// reference-registry-nutrition.js
Layer8DReferenceRegistry.register({
    FmcRecipe: { idColumn: 'recipeId', displayColumn: 'name', displayLabel: 'Recipe' }
});

// reference-registry-billing.js
Layer8DReferenceRegistry.register({
    FmcPartner: { idColumn: 'partnerId', displayColumn: 'name', displayLabel: 'Partner' }
});
```

### Mobile (same data via `Layer8MReferenceRegistry.register()`)

---

## Security Config Design

Per `security-config-structure.md`, three roles with granular access:

### Roles

#### admin
Full access to all services and all data.
```json
{
  "admin-all": {
    "ruleId": "admin-all",
    "elemType": "*",
    "allowed": true,
    "actions": { "-999": true },
    "attributes": { "*": "*" }
  }
}
```

#### coach
Full CRUD on coaching-related entities, scoped to their own members.
```json
{
  "coach-crud-session": {
    "ruleId": "coach-crud-session",
    "elemType": "FmcSession",
    "allowed": true,
    "actions": { "-999": true },
    "attributes": { "*": "*" }
  },
  "coach-deny-other-sessions": {
    "ruleId": "coach-deny-other-sessions",
    "elemType": "FmcSession",
    "allowed": false,
    "actions": {},
    "attributes": {
      "FmcSession": "select * from FmcSession where coachId!=${userId}"
    }
  }
}
```

Coaches get scoped deny rules on: `FmcSession`, `FmcMessage`, `FmcGoal`, `FmcMeal`, `FmcWeightLog`, `FmcHabitLog` — all scoped by `coachId!=${userId}` so coaches only see their own members' data. This works because user provisioning sets `userId = coachId` (following the l8physio pattern where `userId = therapistId`). All six entities have a `coachId` field — `FmcMeal`, `FmcWeightLog`, and `FmcHabitLog` have it auto-populated from the member's assigned coach by their ServiceCallbacks.

Coaches get read-only access to: `FmcMember` (their own), `FmcProgram`, `FmcRecipe`.

Coaches are denied access to: `FmcSubscription`, `FmcPartner`, `FmcCoach` (other coaches).

#### member
Members access data through the member portal, scoped to their own records.

```json
{
  "member-crud-meal": {
    "ruleId": "member-crud-meal",
    "elemType": "FmcMeal",
    "allowed": true,
    "actions": { "1": true, "5": true },
    "attributes": { "*": "*" }
  },
  "member-deny-other-meals": {
    "ruleId": "member-deny-other-meals",
    "elemType": "FmcMeal",
    "allowed": false,
    "actions": {},
    "attributes": {
      "FmcMeal": "select * from FmcMeal where memberId!=${userId}"
    }
  },
  "member-crud-message": {
    "ruleId": "member-crud-message",
    "elemType": "FmcMessage",
    "allowed": true,
    "actions": { "1": true, "3": true, "5": true },
    "attributes": { "*": "*" }
  },
  "member-deny-other-messages": {
    "ruleId": "member-deny-other-messages",
    "elemType": "FmcMessage",
    "allowed": false,
    "actions": {},
    "attributes": {
      "FmcMessage": "select * from FmcMessage where memberId!=${userId}"
    }
  },
  "member-deny-coach-notes": {
    "ruleId": "member-deny-coach-notes",
    "elemType": "FmcSession",
    "allowed": false,
    "actions": {},
    "attributes": {
      "fmcsession.coachnotes": ""
    }
  }
}
```

Members can POST and GET their own: `FmcMeal`, `FmcWeightLog`, `FmcHabitLog`, `FmcMessage` (POST + PATCH for read receipts).
Members can GET their own: `FmcSession` (coach_notes field denied), `FmcGoal`, `FmcSubscription`.
Members are denied: `FmcCoach` (except their own coach), `FmcPartner`, all admin data.

### User Provisioning (Following l8physio Pattern)

The security deny rules use `${userId}` as the runtime placeholder. For data scoping to work, `userId` must equal the entity's ID field (e.g., `userId = coachId` for coaches, `userId = memberId` for members). This is the same pattern used by l8physio where `userId = clientId` / `userId = therapistId`.

#### User Creation Flow

**Admin-created coaches (via admin portal):**
When admin adds a new `FmcCoach` via the admin portal, the `FmcUserProvisioning.createCoachUser()` JavaScript function (following the l8physio `physio-user-provisioning.js` pattern) automatically creates a security user:
```javascript
async function createCoachUser(coach) {
    var userId = coach.coachId;  // userId = coachId so deny-scope rules work
    var roles = {}; roles['coach'] = true;
    await postUser({
        userId: userId,
        fullName: (coach.firstName + ' ' + coach.lastName).trim(),
        email: coach.email,
        accountStatus: 'ACCOUNT_STATUS_ACTIVE',
        portal: 'app.html',  // coach uses the admin/coach portal
        password: { hash: DEFAULT_PASSWORD },
        roles: roles
    });
}
```

**Self-registered members (via l8ui register module):**
Members self-register via `register/index.html` (the l8ui registration page with CAPTCHA). This creates a security user account. On first login, the member portal detects no `FmcMember` record for the logged-in user and shows an onboarding wizard:

1. User registers at `register/index.html` → security account created (userId = user-chosen username)
2. User logs in → redirected to member portal
3. `member-app.js` queries `select * from FmcMember where userId=${currentUser}` 
4. If no FmcMember found → show onboarding wizard collecting: name, height, weight, goal, dietary prefs, GLP-1 status
5. Onboarding wizard POSTs new `FmcMember` with `userId` = logged-in username
6. `FmcMemberServiceCallback.After()` triggers coach matching and creates `FmcSubscription` (Stripe trial)

**Important:** For self-registered members, `userId` = the username chosen at registration. The deny rule `memberId!=${userId}` won't work because `memberId` is auto-generated (e.g., "MBR-001") while `userId` is the login username. Instead, member deny rules use the `userId` field on each entity:
- `FmcMemberServiceCallback.Before(POST)` sets `member.UserId = currentUser` (from auth context)
- All member-owned entities (FmcMeal, FmcWeightLog, etc.) do NOT have their own `userId` field — they reference `memberId`. The deny rules scope on `memberId` which is cross-referenced against FmcMember.userId via the security framework.

**Alternative (simpler, matching l8physio exactly):** Since l8physio uses `userId = entityId`, FMC can follow the same pattern. Admin creates members via the admin portal (just like l8physio creates clients), and user provisioning sets `userId = memberId`. Self-registration is a future enhancement. This approach is simpler and proven.

#### ServiceCallback: Set userId on POST

Following the l8physio `setClientUserId` pattern:

```go
func setMemberUserId(e interface{}, action ifs.Action, vnic ifs.IVNic) error {
    if action != ifs.POST {
        return nil
    }
    member := e.(*fmc.FmcMember)
    member.UserId = member.Email
    return nil
}

func setCoachUserId(e interface{}, action ifs.Action, vnic ifs.IVNic) error {
    if action != ifs.POST {
        return nil
    }
    coach := e.(*fmc.FmcCoach)
    coach.UserId = coach.Email
    return nil
}
```

### Pre-defined Users

```json
{
  "admin": { "userName": "admin", "password": "admin", "roles": { "admin": true } }
}
```

Coach and member users are NOT pre-defined in the security config JSON. They are created dynamically:
- **Coaches:** Created by `FmcUserProvisioning.createCoachUser()` when admin adds a coach (userId = coachId)
- **Members:** Created by `FmcUserProvisioning.createMemberUser()` when admin adds a member (userId = memberId)
- **Mock data:** Phase 6 creates user accounts for all mock coaches and members (following l8physio's `createUsersFromService` pattern)

### Mock Data User Creation (Phase 6)

Following l8physio's `physio_phases.go` pattern:

```go
func runPhase6(client *FmcClient) {
    fmt.Printf("=== Phase 6: User Logins ===\n")
    createUsersFromService(client, "/fmc/10/Member", "FmcMember", "member")
    createUsersFromService(client, "/fmc/10/Coach", "FmcCoach", "coach")
}

func createUsersFromService(client *FmcClient, endpoint, model, label string) {
    // Fetch all entities of the given type
    // For each entity with email:
    //   userId = memberId (for members) or coachId (for coaches)
    //   roleName = "member" or "coach"
    //   portal = "member-app.html" or "app.html"
    //   POST to /fmc/73/users (Security API)
}
```
```

### Stripe Webhook Credentials

```json
"credentials": {
  "postgres": {
    "aside": "fmc",
    "yside": "5432",
    "zside": "admin"
  },
  "stripe": {
    "aside": "<stripe_secret_key>",
    "zside": "<webhook_signing_secret>"
  }
}
```

---

## Mock Data Design

### Data Arrays (`data.go`)

```go
// Member data
var firstNames = []string{"Emma", "Liam", "Olivia", "Noah", "Ava", "James", "Sophia", ...}
var lastNames = []string{"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", ...}
var timezones = []string{"America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"}
var glp1Medications = []string{"Ozempic", "Wegovy", "Mounjaro", "Zepbound"}
var dietaryPrefs = []string{"No restrictions", "Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Pescatarian"}
var referralSources = []string{"Google", "Trustpilot", "Friend referral", "Instagram", "Doctor referral", "GLP-1 provider"}

// Coach data
var certifications = []string{"CNS", "RDN", "CDE", "CHES", "NBHWC", "ACE-CHC"}
var specializations = []string{"Weight Management", "GLP-1 Nutrition", "Emotional Eating", "Sports Nutrition", "Plant-Based", "Metabolic Health"}

// Meal data
var mealDescriptions = map[int][]string{
    1: {"Oatmeal with berries and almonds", "Greek yogurt parfait", "Avocado toast with eggs", ...},
    2: {"Grilled chicken salad", "Turkey and avocado wrap", "Quinoa bowl with vegetables", ...},
    3: {"Salmon with roasted vegetables", "Chicken stir-fry with brown rice", ...},
    4: {"Apple with peanut butter", "Mixed nuts and dark chocolate", "Protein smoothie", ...},
}

// AI feedback templates
var aiFeedbacks = []string{
    "Good protein choice. Consider adding more fiber.",
    "Well-balanced meal with adequate protein and vegetables.",
    "High satiety score — this meal should keep you full for 3-4 hours.",
    ...
}

// Recipe data
var recipeNames = []string{"High-Protein Overnight Oats", "Mediterranean Chicken Bowl", ...}

// Habit data
var habitNames = map[int][]string{
    1: {"Eat protein at every meal", "Add vegetables to lunch", "Stop eating by 8pm", ...},
    2: {"Drink 8 glasses of water", "Start day with water before coffee", ...},
    3: {"Sleep 7+ hours", "No screens after 10pm", ...},
    4: {"Walk 10,000 steps", "Take a 15-min walk after lunch", ...},
    5: {"5-minute meditation", "Journal before bed", ...},
}
```

### Store (`store.go`)

```go
type MockDataStore struct {
    // Phase 1: Core
    MemberIDs  []string
    CoachIDs   []string

    // Phase 2: Coaching
    ProgramIDs []string
    SessionIDs []string
    GoalIDs    []string

    // Phase 3: Nutrition
    MealIDs    []string
    RecipeIDs  []string

    // Phase 4: Progress
    WeightLogIDs []string
    HabitLogIDs  []string

    // Phase 5: Billing
    SubscriptionIDs []string
    PartnerIDs      []string
}
```

### Phase Ordering (`main_phases.go`)

```
Phase 1: Core Foundation
  - Coaches (5 coaches, no dependencies)
  - Programs (4 programs: Weight Loss, GLP-1, Maintenance, Emotional Eating)
  - Partners (3 B2B partners)

Phase 2: Members
  - Members (50 members, references: CoachIDs, ProgramIDs, PartnerIDs)
    - Coach assignment follows matching algorithm (specialization → program_type)
    - 30% on_glp1=true with random glp1_medication
    - weight_unit: 60% LBS, 40% KG (US-heavy user base)
  - Subscriptions (50 subscriptions, references: MemberIDs)
    - Status distribution: 60% ACTIVE, 15% TRIAL, 10% PAUSED, 10% CANCELLED, 5% EXPIRED
    - Each subscription has 1-6 PaymentRecords

Phase 3: Coaching
  - Sessions (200 sessions, references: MemberIDs, CoachIDs)
  - Goals (100 goals, references: MemberIDs, CoachIDs, SessionIDs)
  - Messages (500 messages, references: MemberIDs, CoachIDs)
    - 80% is_read=true, 20% is_read=false (unread)

Phase 4: Nutrition
  - Recipes (100 recipes, no dependencies)
  - Meals (1000 meals, references: MemberIDs)
    - All meals have aiStatus=COMPLETE with populated AI fields
    - Confidence: 70-95% range
    - GLP-1 members get GLP-1-specific ai_feedback

Phase 5: Progress
  - Weight Logs (500 logs, references: MemberIDs)
    - Simulate gradual weight loss trend per member
  - Habit Logs (1000 logs, references: MemberIDs)
    - streak_days: 0-30 range, higher for older members

Phase 6: User Logins (following l8physio createUsersFromService pattern)
  - Fetch all FmcCoach records, create security user per coach (userId = coachId, role = "coach")
  - Fetch all FmcMember records, create security user per member (userId = memberId, role = "member")
  - POST to /fmc/73/users (Security API endpoint)
```

### Generator Files

| File | Models | Lines (est.) |
|------|--------|-------------|
| `gen_core.go` | FmcCoach, FmcProgram, FmcPartner | ~200 |
| `gen_members.go` | FmcMember, FmcSubscription (with PaymentRecords) | ~300 |
| `gen_coaching.go` | FmcSession, FmcGoal (with GoalCheckpoints), FmcMessage | ~400 |
| `gen_nutrition.go` | FmcRecipe (with ingredients/steps), FmcMeal (with nutrients + AI fields) | ~450 |
| `gen_progress.go` | FmcWeightLog, FmcHabitLog | ~200 |
| `main_phases.go` | Phase orchestration + user login creation (Phase 6) | ~300 |

All files under 500 lines per `maintainability.md`.

---

## Deployment

### Docker Images

| Image | Directory | Base Image (runtime) | K8s Kind |
|-------|-----------|---------------------|----------|
| `saichler/fmc` | `go/fmc/main/` | `saichler/erp-postgres` | StatefulSet |
| `saichler/fmc-web` | `go/fmc/ui/` | `saichler/erp-security` | DaemonSet (hostNetwork) |
| `saichler/fmc-member-web` | `go/fmc/member-ui/` | `saichler/erp-security` | DaemonSet (hostNetwork) |
| `saichler/fmc-vnet` | `go/fmc/vnet/` | `saichler/erp-security` | DaemonSet (hostNetwork) |

### build.sh (per image)

```bash
#!/usr/bin/env bash
set -e
docker build --no-cache --platform=linux/amd64 -t saichler/<image>:latest .
docker push saichler/<image>:latest
```

### Dockerfile (standard multi-stage)

```dockerfile
FROM saichler/builder:latest AS build
COPY main.go /home/src/github.com/saichler/build/
RUN go mod init
RUN GOPROXY=direct GOPRIVATE=github.com go mod tidy
RUN go build -o <binary>

FROM saichler/<base>:latest AS final
COPY --from=build /home/src/github.com/saichler/build/<binary> /home/run/<binary>
ENTRYPOINT ["/home/run/<binary>"]
```

### K8s Manifests (`k8s/`)

Per `k8s-yaml-required-entries.md`, all manifests include:
- Namespace with `labels: { name: <namespace> }`
- Resource labels: `{ app: <name> }`
- Container env: `NODE_IP` from `fieldRef: status.hostIP`
- Volume name: `hdata` mounting `/data`

### deploy.sh Order

```bash
kubectl apply -f ./fmc-vnet.yaml
sleep 5
kubectl apply -f ./fmc.yaml
sleep 10
kubectl apply -f ./fmc-web.yaml
kubectl apply -f ./fmc-member-web.yaml
```

### build-all-images.sh

```bash
#!/usr/bin/env bash
set -e
cd fmc/vnet && ./build.sh && cd ../..
cd fmc/main && ./build.sh && cd ../..
cd fmc/ui && ./build.sh && cd ../..
cd fmc/member-ui && ./build.sh && cd ../..
```

---

## Configuration

### login.json (Admin/Coach Portal)

Per `login-json-adaptation.md`:

```json
{
    "login": {
        "appTitle": "FitMate Coach",
        "appDescription": "Coach Portal",
        "authEndpoint": "/auth",
        "redirectUrl": "/app.html",
        "sessionTimeout": 30,
        "tfaEnabled": true
    },
    "app": {
        "dateFormat": "mm/dd/yyyy",
        "apiPrefix": "/fmc",
        "healthPath": "/0/Health"
    }
}
```

### login.json (Member Portal)

```json
{
    "login": {
        "appTitle": "FitMate Coach",
        "appDescription": "Your Personal Nutrition Coach",
        "authEndpoint": "/auth",
        "redirectUrl": "/app.html",
        "sessionTimeout": 30,
        "tfaEnabled": false
    },
    "app": {
        "dateFormat": "mm/dd/yyyy",
        "apiPrefix": "/fmc",
        "healthPath": "/0/Health"
    }
}
```

### defaults.go

```go
package common

import (
    l8c "github.com/saichler/l8common/go/common"
    "github.com/saichler/l8types/go/ifs"
)

const (
    PREFIX = "/fmc/"
)

var DB_CREDS = "postgres"
var DB_NAME = "fmc"

func CreateResources(alias string, logVnet bool) ifs.IResources {
    return l8c.CreateResources(alias, logVnet)
}

var WaitForSignal = l8c.WaitForSignal
var OpenDBConection = l8c.OpenDBConection
```

### UI Type Registration (`go/fmc/ui/main.go`)

```go
func registerCoreTypes(registry ifs.IStructRegistry) {
    introspect.AddPrimaryKeyDecorator(registry, &fmc.FmcMember{}, "MemberId")
    introspect.AddPrimaryKeyDecorator(registry, &fmc.FmcCoach{}, "CoachId")
}

func registerCoachingTypes(registry ifs.IStructRegistry) {
    introspect.AddPrimaryKeyDecorator(registry, &fmc.FmcProgram{}, "ProgramId")
    introspect.AddPrimaryKeyDecorator(registry, &fmc.FmcSession{}, "SessionId")
    introspect.AddPrimaryKeyDecorator(registry, &fmc.FmcMessage{}, "MessageId")
    introspect.AddPrimaryKeyDecorator(registry, &fmc.FmcGoal{}, "GoalId")
}

func registerNutritionTypes(registry ifs.IStructRegistry) {
    introspect.AddPrimaryKeyDecorator(registry, &fmc.FmcMeal{}, "MealId")
    introspect.AddPrimaryKeyDecorator(registry, &fmc.FmcRecipe{}, "RecipeId")
}

func registerProgressTypes(registry ifs.IStructRegistry) {
    introspect.AddPrimaryKeyDecorator(registry, &fmc.FmcWeightLog{}, "LogId")
    introspect.AddPrimaryKeyDecorator(registry, &fmc.FmcHabitLog{}, "LogId")
}

func registerBillingTypes(registry ifs.IStructRegistry) {
    introspect.AddPrimaryKeyDecorator(registry, &fmc.FmcSubscription{}, "SubscriptionId")
    introspect.AddPrimaryKeyDecorator(registry, &fmc.FmcPartner{}, "PartnerId")
}
```

### ModConfig Handling

Per `modconfig-failure-no-logout.md`: FMC does not have a ModConfig service initially. The `Layer8DModuleFilter.load()` call must be removed from `app.js` to prevent infinite logout loops.

---

## Local Development Setup

### run-local.sh

Copied from `../l8erp/go/run-local.sh` and adapted per `run-local-script.md`:

1. Clean and fetch dependencies
2. Start PostgreSQL container (`unsecure-postgres`)
3. Build binaries: `mocks_demo`, `vnet_demo`, `fmc_demo`, `ui_demo`, `member_ui_demo`
4. Copy web assets to `demo/` (both admin and member portals)
5. Generate `kill_demo.sh`
6. Start services: vnet -> fmc -> ui -> member-ui
7. Upload mock data via `mocks_demo`
8. Wait for user, then cleanup

---

## Implementation Phases

### Phase 1: Project Skeleton

1. Create `proto/fmc.proto` with all messages and enums
2. Create `proto/make-bindings.sh` (copy from l8erp, adapt)
3. Run `make-bindings.sh` to generate `go/types/fmc/*.pb.go`
4. Create `go/fmc/common/defaults.go`
5. Set up `go/` module: `go mod init`, vendor dependencies
6. Add l8ui submodule: copy `setup-l8ui-submodule.sh` from `../l8ui/`, run it in `go/fmc/ui/web/` and `go/fmc/member-ui/web/`

### Phase 2: Core Services (Service Area 10)

1. `FmcMemberService.go` + `FmcMemberServiceCallback.go` (includes coach matching logic)
2. `FmcCoachService.go` + `FmcCoachServiceCallback.go`
3. Service activation in `go/fmc/services/activate.go`

### Phase 3: Coaching Services (Service Area 20)

1. `FmcProgramService.go` + callback
2. `FmcSessionService.go` + callback (notification hooks for reminders)
3. `FmcMessageService.go` + callback (reject PUT entirely; allow PATCH only for isRead/readAt fields; notification hooks)
4. `FmcGoalService.go` + callback (notification hooks for milestones)

### Phase 4: Nutrition Services (Service Area 30)

1. `FmcMealService.go` + callback (AI integration hook, async analysis trigger)
2. `FmcRecipeService.go` + callback
3. `FmcMealAIService.go` (LLM integration via l8agent patterns)

### Phase 5: Progress Services (Service Area 40)

1. `FmcWeightLogService.go` + callback
2. `FmcHabitLogService.go` + callback

### Phase 6: Billing Services (Service Area 50) + Tools (Service Area 55)

1. `FmcSubscriptionService.go` + callback (Stripe API integration)
2. `FmcPartnerService.go` + callback
3. `FmcStripeWebhookService.go` (webhook event handler)
4. `FmcToolService.go` (public calculators: protein, meal plan, nutrient gap)

### Phase 7: Main Entry Points

1. `go/fmc/main/main.go` (backend server)
2. `go/fmc/vnet/main.go` (virtual network)
3. `go/fmc/ui/main.go` (admin/coach UI server + type registration)
4. `go/fmc/member-ui/main.go` (member portal UI server)

### Phase 8: Security Config

1. Create `go/secure/plugin/fmc/fmc.json` with admin, coach, member roles
2. Implement deny rules for coach data scoping (coachId)
3. Implement deny rules for member data scoping (memberId)
4. Field-level denial: coach_notes hidden from members
5. Stripe webhook credentials in credentials section
6. FmcTool service exempted from auth (public endpoint)

### Phase 9: Desktop UI (Admin/Coach Portal)

1. Copy `css/base-core.css` and `css/responsive.css` from l8erp
2. Create `login.html`, `login.json`, `index.html`, `app.html` (body from l8erp)
3. Create `js/sections.js` and `js/app.js`
4. Per-module: config, enums, columns, forms, init files
5. Section HTML for each module
6. Reference registry files
7. Wire all scripts into `app.html` per `desktop-script-loading-order.md`
8. Chat UI for Messages service (split-pane conversation view)
9. `fmc-user-provisioning.js` — auto-creates security user when admin adds a Coach or Member (following l8physio `physio-user-provisioning.js` pattern; userId = coachId/memberId)

### Phase 10: Mobile UI (Admin/Coach)

1. Create `m/app.html` (body from l8erp mobile)
2. Create `m/js/app-core.js`
3. Per-module: enums, columns (with primary/secondary), forms, index files
4. Nav config files
5. Mobile reference registries
6. Wire all scripts per `mobile-script-loading-order.md`

### Phase 11: Member Portal

1. Create `go/fmc/member-ui/web/` directory structure
2. Create `login.html`, `register/index.html` (l8ui register module for member self-registration with CAPTCHA), `login.json`, `index.html`, `app.html` (mobile-first bottom tab layout)
3. `member-app.js` — tab navigation, WebSocket connection, first-login onboarding detection (query FmcMember by userId, show wizard if none found)
4. `member-dashboard.js` — today's summary with meal/goal/session cards
5. `member-meal-log.js` — photo upload, AI analysis status, nutritional breakdown display
6. `member-chat.js` — real-time messaging with coach (WebSocket)
7. `member-progress.js` — weight chart (line), habit calendar
8. `member-profile.js` — profile editing, unit preferences
9. `member-utils.js` — unit conversion utilities
10. `css/member.css` — member-specific styles

### Phase 12: Mock Data

1. `data.go` — curated name arrays (including AI feedback templates)
2. `store.go` — ID slices
3. Generator files: `gen_core.go`, `gen_members.go`, `gen_coaching.go`, `gen_nutrition.go`, `gen_progress.go`
4. Phase files: `main_phases.go` (includes Phase 6: user login creation following l8physio `createUsersFromService` pattern)
5. CLI entry point: `cmd/main.go`
6. Build and verify: `go build ./tests/mocks/` and `go vet ./tests/mocks/`

### Phase 13: Notification System

1. Import l8notify library
2. Register notification senders (email via SMTP, in-app via WebSocket)
3. Implement notification triggers in ServiceCallbacks
4. Implement scheduled notification goroutines (meal nudges, coach check-ins)
5. Implement escalation rules (no-show, payment failure, inactivity)

### Phase 14: Deployment Artifacts

1. Per-service: `build.sh`, `Dockerfile` (4 images: fmc, fmc-web, fmc-member-web, fmc-vnet)
2. K8s manifests: `fmc.yaml`, `fmc-web.yaml`, `fmc-member-web.yaml`, `fmc-vnet.yaml`
3. `k8s/deploy.sh`, `k8s/undeploy.sh`
4. `go/build-all-images.sh`

### Phase 15: run-local.sh

1. Copy from `../l8erp/go/run-local.sh`
2. Adapt binary names, paths, ports, credentials
3. Include both admin and member UI servers
4. Test end-to-end

### Phase 16: End-to-End Verification

For every section affected:
1. Navigate to each section
2. Verify table data loads (not blank)
3. Verify row click opens detail/modal
4. Verify detail content is populated (not empty)
5. Verify CRUD operations work
6. Verify on both desktop and mobile

Sections to verify:
- [ ] Desktop: Dashboard widgets load with data
- [ ] Desktop: Core > Members table + detail + CRUD (verify coach auto-assignment on Add)
- [ ] Desktop: Core > Coaches table + detail + CRUD
- [ ] Desktop: Coaching > Programs table + detail + CRUD
- [ ] Desktop: Coaching > Sessions table + detail + CRUD + calendar view + kanban view
- [ ] Desktop: Coaching > Messages table + detail (read-only, no edit/delete) + chat UI
- [ ] Desktop: Coaching > Goals table + detail + CRUD + kanban view
- [ ] Desktop: Nutrition > Meals table + detail + CRUD + chart view (verify AI status display)
- [ ] Desktop: Nutrition > Recipes table + detail + CRUD (with inline ingredients/steps)
- [ ] Desktop: Progress > Weight Logs table + detail + CRUD + chart view (verify unit display)
- [ ] Desktop: Progress > Habit Logs table + detail + CRUD + chart view
- [ ] Desktop: Billing > Subscriptions table + detail + CRUD + chart view (with inline PaymentRecords)
- [ ] Desktop: Billing > Partners table + detail + CRUD
- [ ] Desktop: System section (Health, Security, Logs, Modules, Data Import)
- [ ] Mobile: Core > Members card list + detail
- [ ] Mobile: Core > Coaches card list + detail
- [ ] Mobile: Coaching > Sessions card list + detail + calendar view
- [ ] Mobile: Coaching > Messages card list + detail (read-only) + chat UI
- [ ] Mobile: Coaching > Goals card list + detail + kanban view
- [ ] Mobile: Nutrition > Meals card list + detail (AI analysis display)
- [ ] Mobile: Nutrition > Recipes card list + detail
- [ ] Mobile: Progress > Weight Logs card list + detail + chart view
- [ ] Mobile: Progress > Habit Logs card list + detail
- [ ] Mobile: Billing > Subscriptions card list + detail
- [ ] Mobile: Billing > Partners card list + detail
- [ ] Member Portal: Dashboard loads today's summary
- [ ] Member Portal: Meal logging with photo upload → AI analysis display
- [ ] Member Portal: Chat with coach (real-time via WebSocket)
- [ ] Member Portal: Progress charts (weight trend, habit calendar)
- [ ] Member Portal: Self-registration via register/index.html (CAPTCHA, account creation)
- [ ] Member Portal: First-login onboarding wizard (creates FmcMember, triggers coach matching)
- [ ] Member Portal: Profile editing (unit preferences)
- [ ] Member Portal: Session list with upcoming session details
- [ ] Notifications: Session reminder triggers
- [ ] Notifications: New message notification appears in real-time
- [ ] Notifications: Meal nudge fires at configured times
- [ ] Free Tools: Protein calculator returns correct result (no auth required)

---

## Traceability Matrix

| # | Area | Item | Phase |
|---|------|------|-------|
| 1 | Proto | fmc.proto with all messages, enums, child types | Phase 1 |
| 2 | Proto | make-bindings.sh, generate .pb.go | Phase 1 |
| 3 | Common | defaults.go (PREFIX, DB) | Phase 1 |
| 4 | Submodule | l8ui submodule setup (admin + member portals) | Phase 1 |
| 5 | Service | FmcMemberService + callback (coach matching) | Phase 2 |
| 6 | Service | FmcCoachService + callback | Phase 2 |
| 7 | Service | Service activation (activate.go) | Phase 2 |
| 8 | Service | FmcProgramService + callback | Phase 3 |
| 9 | Service | FmcSessionService + callback (notification hooks) | Phase 3 |
| 10 | Service | FmcMessageService + callback (immutable, notifications) | Phase 3 |
| 11 | Service | FmcGoalService + callback (milestone notifications) | Phase 3 |
| 12 | Service | FmcMealService + callback (async AI trigger) | Phase 4 |
| 13 | Service | FmcRecipeService + callback | Phase 4 |
| 14 | Service | FmcMealAIService (l8agent LLM integration) | Phase 4 |
| 15 | Service | FmcWeightLogService + callback | Phase 5 |
| 16 | Service | FmcHabitLogService + callback | Phase 5 |
| 17 | Service | FmcSubscriptionService + callback (Stripe API) | Phase 6 |
| 18 | Service | FmcPartnerService + callback | Phase 6 |
| 19 | Service | FmcStripeWebhookService (Stripe webhooks) | Phase 6 |
| 20 | Service | FmcToolService (public calculators) | Phase 6 |
| 21 | Entry | Backend main.go | Phase 7 |
| 22 | Entry | Vnet main.go | Phase 7 |
| 23 | Entry | Admin UI main.go + type registration | Phase 7 |
| 24 | Entry | Member portal UI main.go | Phase 7 |
| 25 | Security | fmc.json security config (admin, coach, member roles) | Phase 8 |
| 26 | Security | Coach deny rules (scoped by coachId) | Phase 8 |
| 27 | Security | Member deny rules (scoped by memberId) | Phase 8 |
| 28 | Security | Member field-level denial (coach_notes) | Phase 8 |
| 29 | Security | Stripe credentials in security config | Phase 8 |
| 30 | Security | FmcTool public endpoint exemption | Phase 8 |
| 31 | UI Desktop | base-core.css, responsive.css | Phase 9 |
| 32 | UI Desktop | login.html, login.json, index.html, app.html | Phase 9 |
| 33 | UI Desktop | sections.js, app.js (no ModConfig) | Phase 9 |
| 34 | UI Desktop | Core module: config, enums, columns, forms, init | Phase 9 |
| 35 | UI Desktop | Coaching module: config, enums, columns, forms, init | Phase 9 |
| 36 | UI Desktop | Nutrition module: config, enums, columns, forms, init | Phase 9 |
| 37 | UI Desktop | Progress module: config, enums, columns, forms, init | Phase 9 |
| 38 | UI Desktop | Billing module: config, enums, columns, forms, init | Phase 9 |
| 39 | UI Desktop | Section HTML (6 sections + system) | Phase 9 |
| 40 | UI Desktop | Reference registries (5 files) | Phase 9 |
| 41 | UI Desktop | Immutability: FmcMessage read-only table | Phase 9 |
| 42 | UI Desktop | View types: calendar, kanban, chart, timeline per service | Phase 9 |
| 43 | UI Desktop | Chat UI: split-pane messages with WebSocket | Phase 9 |
| 44 | UI Mobile | m/app.html, m/js/app-core.js | Phase 10 |
| 45 | UI Mobile | Per-module: enums, columns, forms, index (5 modules) | Phase 10 |
| 46 | UI Mobile | Nav config files | Phase 10 |
| 47 | UI Mobile | Mobile reference registries | Phase 10 |
| 48 | Member Portal | Directory structure + l8ui submodule | Phase 11 |
| 49 | Member Portal | login.html, login.json, app.html (bottom tab layout) | Phase 11 |
| 50 | Member Portal | member-app.js (tab nav, WebSocket connection) | Phase 11 |
| 51 | Member Portal | member-dashboard.js (today's summary) | Phase 11 |
| 52 | Member Portal | member-meal-log.js (photo upload, AI status) | Phase 11 |
| 53 | Member Portal | member-chat.js (real-time messaging) | Phase 11 |
| 54 | Member Portal | member-progress.js (weight chart, habit calendar) | Phase 11 |
| 55 | Member Portal | member-profile.js (unit preferences) | Phase 11 |
| 56 | Member Portal | member-utils.js (unit conversion) | Phase 11 |
| 57 | Member Portal | css/member.css (member-specific styles) | Phase 11 |
| 58 | Mock | data.go name arrays (incl. AI feedback templates) | Phase 12 |
| 59 | Mock | store.go ID slices | Phase 12 |
| 60 | Mock | gen_core.go, gen_members.go, gen_coaching.go, gen_nutrition.go, gen_progress.go | Phase 12 |
| 61 | Mock | main_phases.go + cmd/main.go | Phase 12 |
| 62 | Notify | l8notify integration + sender registration | Phase 13 |
| 63 | Notify | ServiceCallback notification triggers | Phase 13 |
| 64 | Notify | Scheduled notifications (meal nudges, coach check-ins) | Phase 13 |
| 65 | Notify | Escalation rules (no-show, payment failure, inactivity) | Phase 13 |
| 66 | Deploy | build.sh + Dockerfile (4 images) | Phase 14 |
| 67 | Deploy | K8s manifests (4 yamls) | Phase 14 |
| 68 | Deploy | deploy.sh, undeploy.sh, build-all-images.sh | Phase 14 |
| 69 | Dev | run-local.sh (includes member portal) | Phase 15 |
| 70 | Verify | End-to-end verification (desktop + mobile + member portal) | Phase 16 |
| 71 | Security | User provisioning JS (createCoachUser, createMemberUser — userId=entityId) | Phase 9 |
| 72 | Security | Mock data Phase 6: createUsersFromService for coaches and members | Phase 12 |
| 73 | Member Portal | register/index.html (l8ui register module with CAPTCHA) | Phase 11 |
| 74 | Member Portal | First-login onboarding wizard (FmcMember creation + coach matching + Stripe trial) | Phase 11 |
| 75 | Proto | coach_id on FmcMeal, FmcWeightLog, FmcHabitLog (auto-populated, enables coach scoping) | Phase 1 |
| 76 | Proto | l8common.Money on FmcProgram.price, FmcSubscription.price, PaymentRecord.amount | Phase 1 |
| 77 | Proto | file_name + file_size companion fields on all storage_path fields | Phase 1 |

---

## PRD Compliance Checklist

### Project Structure & Architecture
- [x] Project structure follows l8erp layout
- [x] Directory names and file naming conventions match l8erp patterns
- [x] `defaults.go` with PREFIX constant

### Protobuf Design
- [x] Enum zero values are UNSPECIFIED (`proto-enum-zero-value.md`)
- [x] List types use `repeated X list = 1` + metadata convention (`proto-list-convention.md`)
- [x] No direct struct references between Prime Objects — ID fields only (`prime-object-references.md`)
- [x] Child entities are embedded `repeated` fields (`prime-object-references.md`)
- [x] Single proto file for the project (matching l8physio pattern)
- [x] Money fields use `l8common.Money` type (`money-field-type-mapping.md`)

### Service Design
- [x] All ServiceName values are 10 characters or less (`maintainability.md`)
- [x] ServiceArea is consistent within each module (`maintainability.md`)
- [x] ServiceCallback auto-generates primary key on POST (`maintainability.md`)
- [x] Types registered in UI main.go (`maintainability.md`)
- [x] Model names match protobuf types in L8Query and JS (`protobuf-model-names.md`)

### UI Design
- [x] All UI module integration steps planned (`adding-module-desktop.md`, `adding-module-mobile.md`)
- [x] Desktop and mobile parity addressed (`mobile-rules.md`)
- [x] Immutable entities (FmcMessage) have read-only UI; read receipts use PATCH not PUT (`immutability-ui-alignment.md`)
- [x] Child types use inline tables (RecipeIngredient, RecipeStep, GoalCheckpoint, PaymentRecord) (`prime-object-references.md`)
- [x] app.html body copied from l8erp (`app-html-body-from-l8erp.md`)
- [x] css/base-core.css included (`app-html-body-from-l8erp.md`)
- [x] login.json adapted with correct apiPrefix (`login-json-adaptation.md`)
- [x] index.html redirect included (`index-html-redirect.md`)
- [x] ModConfig load removed from app.js (`modconfig-failure-no-logout.md`)
- [x] l8ui submodule setup via script (`l8ui-copy-to-new-project.md`)
- [x] Reference registries for all lookupModel entities (`reference-registry-completeness.md`)
- [x] Theme uses --layer8d-* CSS custom properties (`l8ui-theme-compliance.md`)
- [x] No project-specific code in l8ui (`l8ui-no-project-specific-code.md`)

### Member Portal
- [x] Member portal designed as primary product surface
- [x] Separate UI process (fmc-member-web) following l8physio boostapp pattern
- [x] Mobile-first bottom tab layout (not sidebar)
- [x] Meal logging with photo upload + AI analysis async flow
- [x] Real-time chat with coach via WebSocket
- [x] Progress tracking (weight chart, habit calendar)
- [x] Unit preferences (weight/height) with conversion utilities
- [x] Security scoping ensures member sees only own data (userId=memberId following l8physio pattern)
- [x] User provisioning: coach/member users created with userId=entityId (l8physio `physio-user-provisioning.js` pattern)
- [x] Member self-registration via l8ui register module (`register/index.html` with CAPTCHA)
- [x] First-login onboarding wizard creates FmcMember + triggers coach matching + Stripe trial

### Real-Time Messaging
- [x] Built on l8web WebSocketManager — no custom WebSocket server
- [x] Auto-notifications via cache-triggered L8NotificationSet
- [x] Read receipts with `isRead` + `readAt` fields
- [x] Unread count tracking for both coach and member portals
- [x] Chat UI designed for both desktop (split-pane) and member portal (full-screen)

### AI Integration
- [x] l8agent patterns for LLM orchestration
- [x] Async pipeline: POST meal → PENDING → ANALYZING → COMPLETE/FAILED
- [x] FmcAiStatus enum for tracking analysis state
- [x] Error handling with retry logic (3 retries, exponential backoff)
- [x] GLP-1-specific prompt variations (protein targets, calorie warnings, nutrient gaps)
- [x] Data masking for PII before LLM calls

### Notification System
- [x] l8notify library integration for multi-channel delivery
- [x] 8 notification types covering all user-facing events
- [x] Escalation rules for no-show, payment failure, inactivity
- [x] Scheduled notifications (meal nudges, coach check-ins) via background goroutines
- [x] ServiceCallback hooks for event-driven notifications

### Stripe Integration
- [x] StripeWH service for webhook handling (ServiceArea 50)
- [x] Subscription lifecycle: trial → active → paused → cancelled
- [x] 5 Stripe webhook events handled with specific actions
- [x] PaymentRecord child type tracks payment history with failure_reason
- [x] Stripe credentials stored in security config
- [x] Pause duration cap (30 days) with auto-resume/cancel

### Free Tools
- [x] FmcTool service (ServiceArea 55) with public endpoints
- [x] 3 calculators: protein, meal plan, nutrient gap
- [x] Stateless — no database, no user context, no auth
- [x] Lead generation CTA to paid product

### Coach-Member Matching
- [x] Auto-assignment on member POST based on specialization + capacity
- [x] Coach switching via PUT with capacity enforcement
- [x] active_clients increment/decrement on assignment changes
- [x] max_clients cap enforced on assignment

### Mock Data
- [x] All services have mock data generators planned (`data-completeness-pipeline.md`)
- [x] Phase ordering accounts for cross-module dependencies (`mock-phase-ordering.md`)
- [x] Generator files under 500 lines (`maintainability.md`)
- [x] store.go has ID slices for all entities
- [x] AI fields populated with realistic mock data (aiStatus=COMPLETE, feedback templates)
- [x] Unit preferences populated (60% LBS, 40% KG)
- [x] PaymentRecords populated with succeeded/failed distribution

### Deployment
- [x] 4 deployable services include build.sh, Dockerfile, K8s YAML (`deployment-artifacts.md`)
- [x] run-local.sh section included (`run-local-script.md`)
- [x] K8s YAMLs include all required entries: namespace labels, resource labels, NODE_IP env, hdata volume (`k8s-yaml-required-entries.md`)
- [x] deploy.sh applies in dependency order (vnet first)
- [x] Member portal has its own Docker image and K8s manifest

### Configuration
- [x] login.json adapted with correct apiPrefix, appTitle (`login-json-adaptation.md`)
- [x] Separate login.json for member portal (different appDescription, no TFA)
- [x] ModConfig handling addressed (`modconfig-failure-no-logout.md`)
- [x] Security config designed with roles and scoping rules (`security-config-structure.md`)
- [x] Security provisioning via config JSON only (`security-provisioning-channels.md`)

### Testing
- [x] Tests will live in `go/tests/` directory (`test-location-and-approach.md`)
- [x] Tests use system API (IVNic, service endpoints) (`test-location-and-approach.md`)

### Code Quality
- [x] No Go generics (`no-go-generics.md`)
- [x] No vendor edits planned (`never-edit-vendor.md`)
- [x] No framework interface modifications (`framework-interface-boundaries.md`)
- [x] File upload uses FileStore pattern with companion file_name/file_size fields (`file-upload-pattern.md`)
- [x] Build verification uses `go build ./...` (`cleanup-test-binaries.md`)

### Platform Completeness
- [x] Audit covers desktop, mobile, AND member portal (`plan-platform-completeness.md`)
- [x] Traceability matrix covers all three platforms (`plan-platform-completeness.md`)
- [x] Verification phase has per-platform items including member portal (`plan-platform-completeness.md`)

### Not Applicable (Explicit Exemptions)
- N/A: `l8pollaris-binary-deployment.md` — FMC does not use l8pollaris collection/parsing
- N/A: `demo-directory-sync.md` — No demo directory editing planned
- N/A: `plan-duplication-audit.md` — No duplicate behavioral code; all modules use shared factory pattern
