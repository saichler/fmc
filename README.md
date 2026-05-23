# FMC - FitMate Coach

A B2C 1-on-1 weight loss coaching platform that combines certified human nutrition coaches with AI-powered meal analysis. Built on the [Layer 8 Ecosystem](https://github.com/saichler).

## What Is FitMate Coach?

FitMate Coach pairs each member with a dedicated nutrition coach who provides weekly sessions (alternating phone/video calls and text-based sessions), unlimited between-session messaging, and personalized habit-based guidance. An AI meal advisor analyzes food photos and text descriptions to provide instant nutritional feedback, which coaches use to identify patterns and set targeted weekly goals.

**Key differentiators:**
- Human-led coaching + AI-powered meal feedback at $69/month (vs. $200-500+ for traditional 1-on-1 coaching)
- Habit-based approach, not meal plans or calorie counting
- Specialized GLP-1 companion program for Ozempic/Wegovy/Mounjaro/Zepbound users
- AI pattern detection for hunger triggers, hidden calorie sources, and eating habits
- Free public tools (protein calculator, meal plan generator) as lead generation funnel

## Architecture

FMC is built on the Layer 8 framework with 6 service modules:

| Module | Service Area | Purpose |
|--------|-------------|---------|
| **Core** | 10 | Members, Coaches, Coach-Member matching |
| **Coaching** | 20 | Programs, Sessions, Messages, Goals |
| **Nutrition** | 30 | Meals (with AI analysis), Recipes |
| **Progress** | 40 | Weight logs, Habit tracking |
| **Billing** | 50 | Subscriptions, Stripe webhooks, B2B Partners |
| **Tools** | 55 | Free public calculators (protein, meal plan, nutrient gap) |

### Three User Portals

| Portal | Users | Description |
|--------|-------|-------------|
| **Admin/Coach Portal** (Desktop + Mobile) | Admins, Coaches | Full platform management. Coaches see only their own members' data. |
| **Member Portal** | Members | Mobile-first SPA with bottom tab navigation: Home, Log Meal, Chat, Progress, Profile |

### Deployable Services

| Image | Purpose |
|-------|---------|
| `saichler/fmc` | Backend services (PostgreSQL) |
| `saichler/fmc-web` | Admin/Coach portal web server |
| `saichler/fmc-member-web` | Member portal web server |
| `saichler/fmc-vnet` | Virtual network layer |

## Key Features

### AI Meal Analysis
Members log meals via photo or text description. The AI meal advisor (powered by l8agent LLM integration) analyzes each meal asynchronously and returns:
- Calorie count and macro breakdown (protein, carbs, fat, fiber)
- Satiety score (1-10)
- Personalized feedback and suggestions
- Confidence percentage
- Micronutrient breakdown

GLP-1 users receive specialized prompts targeting protein adequacy (30g+/meal), minimum calorie warnings, and nutrient gap detection.

### Real-Time Messaging
Built on the framework's WebSocket infrastructure (`l8web.WebSocketManager`):
- Instant message delivery between coach and member
- Read receipts with real-time status updates
- Unread message count badges
- File attachment support for sharing meal photos

### Coach-Member Matching
Automatic coach assignment on member creation:
- Matches coach specialization to member's program type
- Selects coach with lowest capacity utilization
- Enforces max client caps
- Supports admin override and coach switching

### Stripe Payment Integration
Full subscription lifecycle management via webhook handler:
- Trial -> Active -> Paused -> Cancelled flow
- Payment history tracking with failure reasons
- Auto-pause on extended payment failure (14-day escalation)
- 30-day pause duration cap with auto-resume

### Notification System
Multi-channel notifications via l8notify:
- Session reminders (24h and 1h before)
- Meal logging nudges (no meal by midday/evening)
- New message alerts
- Goal milestone celebrations
- Payment failure escalations
- Member inactivity alerts (3/5/7 day escalation)

### Free Public Tools
Lead generation calculators requiring no authentication:
- **Protein Calculator**: Daily protein target based on weight, activity, goals, GLP-1 status
- **Meal Plan Generator**: Personalized meal plan based on dietary preferences
- **Nutrient Gap Checker**: GLP-1 deficiency risk assessment based on symptoms

## Security Model

Three roles with granular access control:

| Role | Access |
|------|--------|
| **Admin** | Full access to all data and operations |
| **Coach** | CRUD on coaching entities, scoped to own members via `coachId` deny rules |
| **Member** | Own data only (meals, weight logs, habits, messages), scoped via `memberId` deny rules. Coach notes on sessions are field-level denied. |

## Project Structure

```
fmc/
├── proto/
│   ├── fmc.proto              # All protobuf definitions
│   └── make-bindings.sh
├── go/
│   ├── fmc/
│   │   ├── common/            # PREFIX, DB config
│   │   ├── core/              # Member + Coach services
│   │   ├── coaching/          # Program, Session, Message, Goal services
│   │   ├── nutrition/         # Meal + Recipe + MealAI services
│   │   ├── progress/          # WeightLog + HabitLog services
│   │   ├── billing/           # Subscription, Partner, Stripe webhook services
│   │   ├── tools/             # Free public calculators
│   │   ├── main/              # Backend server entry point
│   │   ├── vnet/              # Virtual network entry point
│   │   ├── ui/                # Admin/Coach portal (desktop + mobile)
│   │   └── member-ui/         # Member portal
│   ├── types/fmc/             # Generated .pb.go files
│   ├── tests/mocks/           # Mock data generators
│   ├── secure/plugin/fmc/     # Security config (roles, deny rules, credentials)
│   └── k8s/                   # Kubernetes manifests
└── plans/
    └── fmc-prd.md             # Product Requirements Document
```

## Local Development

### Prerequisites
- Go 1.21+
- Docker
- Layer 8 framework dependencies (vendored)

### Quick Start

```bash
cd go
./run-local.sh
```

This will:
1. Fetch dependencies and vendor them
2. Start PostgreSQL in Docker
3. Build all binaries (backend, vnet, admin UI, member UI, mock data generator)
4. Start all services
5. Upload mock data (5 coaches, 50 members, 1000 meals, 500 messages, etc.)
6. Admin portal: `https://localhost:2773/app.html` (admin/admin)
7. Member portal: `https://localhost:2774/app.html`

### Build Docker Images

```bash
cd go
./build-all-images.sh
```

### Deploy to Kubernetes

```bash
cd k8s
./deploy.sh    # Apply manifests in dependency order
./undeploy.sh  # Remove all resources
```

## Data Model

### Prime Objects (with their own services)

| Entity | Module | Key Fields |
|--------|--------|------------|
| FmcMember | Core | name, email, coach assignment, program, GLP-1 status, unit preferences |
| FmcCoach | Core | name, certification, specialization, capacity |
| FmcProgram | Coaching | name, type (Weight Loss/GLP-1/Maintenance/Emotional), duration, price |
| FmcSession | Coaching | member, coach, type (video/phone/text), status, scheduled time |
| FmcMessage | Coaching | member, coach, sender, content, read status (immutable after creation) |
| FmcGoal | Coaching | member, coach, title, status, checkpoints |
| FmcMeal | Nutrition | member, meal type, photo/text, AI analysis results |
| FmcRecipe | Nutrition | name, category, nutrition info, ingredients, steps |
| FmcWeightLog | Progress | member, date, weight (stored in grams) |
| FmcHabitLog | Progress | member, date, habit name, category, streak |
| FmcSubscription | Billing | member, plan, status, Stripe IDs, payment history |
| FmcPartner | Billing | B2B partner (employer, medical, telehealth) |

### Embedded Child Types (no separate services)
- MealNutrient (in FmcMeal)
- RecipeIngredient, RecipeStep (in FmcRecipe)
- GoalCheckpoint (in FmcGoal)
- PaymentRecord (in FmcSubscription)

## Unit Preferences

All measurements are stored in metric internally (grams, centimeters). Members choose their display preference (kg/lbs, cm/in), and the UI handles conversion for display and input.

## License

Copyright 2025 Sharon Aicler (saichler@gmail.com)

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
