# 🚚 TransitOps

**Smart Transport Operations Platform** — an end-to-end fleet, dispatch, maintenance and expense management system with a hard-enforced business-rules engine.

> Built in 8 hours for `oddo hackathon` · Problem Statement: **TransitOps**

[![Frontend](https://img.shields.io/badge/frontend-React%2019%20+%20TypeScript-61dafb)]()
[![Backend](https://img.shields.io/badge/backend-Spring%20Boot%203-6db33f)]()
[![DB](https://img.shields.io/badge/database-PostgreSQL-336791)]()

---

## 🔗 Links

| | |
|---|---|
| **Live App** | https://transitops.vercel.app *(update)* |
| **API Base** | https://transitops-api.up.railway.app/api *(update)* |
| **Demo Video** | *(2-min walkthrough — update)* |
| **Mockup Reference** | [Excalidraw](https://link.excalidraw.com/l/65VNwvy7c4X/1FHGDNgD2td) |

---

## 🎯 The Problem

Logistics companies still run their fleets on spreadsheets and paper logbooks. The result: vehicles double-booked, drivers dispatched on expired licences, trucks overloaded past their rated capacity, maintenance forgotten, and zero visibility into what any of it actually costs.

**TransitOps digitises the whole lifecycle** — vehicle registry → driver compliance → dispatch → maintenance → fuel & expenses → analytics — and makes the rules *impossible to break*, not just documented somewhere.

---

## 🔐 Demo Credentials

One login, four roles. Every role sees a different slice of the app.

| Role | Email | Password | Can access |
|---|---|---|---|
| **Fleet Manager** | `fleet@transitops.in` | `demo1234` | Fleet, Drivers, Maintenance, Analytics |
| **Dispatcher** | `dispatch@transitops.in` | `demo1234` | Dashboard, Trips, Fleet *(view)* |
| **Safety Officer** | `safety@transitops.in` | `demo1234` | Drivers, Compliance, Trips *(view)* |
| **Financial Analyst** | `finance@transitops.in` | `demo1234` | Fuel & Expenses, Analytics, Fleet *(view)* |

---

## ✅ Mandatory Business Rules — All 10 Implemented

Every rule from **Section 4** of the problem statement is enforced **server-side** in a single, testable rules engine (`core/rules/`), and mirrored client-side for instant feedback.

| # | Rule | Status | Where |
|---|---|---|---|
| 1 | Vehicle registration number must be unique | ✅ | DB unique constraint + service validation |
| 2 | Retired / In Shop vehicles never appear in dispatch selection | ✅ | `TripRules.validateDispatch()` + filtered dropdown |
| 3 | Drivers with expired licences or Suspended status cannot be assigned | ✅ | `TripRules.validateDispatch()` |
| 4 | A driver or vehicle already **On Trip** cannot be double-assigned | ✅ | `TripRules.validateDispatch()` |
| 5 | Cargo weight must not exceed vehicle max load capacity | ✅ | `TripRules.validateDispatch()` — live UI feedback |
| 6 | Dispatch → vehicle **and** driver both become **On Trip** | ✅ | `StatusMachine` (single `@Transactional`) |
| 7 | Complete → vehicle **and** driver both revert to **Available** | ✅ | `StatusMachine` |
| 8 | Cancel a dispatched trip → both restored to **Available** | ✅ | `StatusMachine` |
| 9 | Active maintenance record → vehicle becomes **In Shop** | ✅ | `MaintenanceService` |
| 10 | Closing maintenance → vehicle back to **Available** *(unless Retired)* | ✅ | `MaintenanceService` |

### The rules engine

All validation lives in **pure static functions** with zero DB access — easy to reason about, easy to unit-test, and impossible to accidentally bypass from a different module.

```java
// core/rules/TripRules.java
public static List<String> validateDispatch(Vehicle v, Driver d, int cargoKg) {
    List<String> errors = new ArrayList<>();

    if (v.getStatus() == RETIRED || v.getStatus() == IN_SHOP)
        errors.add("Vehicle " + v.getRegNo() + " is " + v.getStatus() + " — not dispatchable");
    if (v.getStatus() == ON_TRIP)
        errors.add("Vehicle already assigned to another trip");

    if (d.getLicenseExpiry().isBefore(LocalDate.now()))
        errors.add("Driver licence expired on " + d.getLicenseExpiry());
    if (d.getStatus() == SUSPENDED)
        errors.add("Driver is suspended");
    if (d.getStatus() == DriverStatus.ON_TRIP)
        errors.add("Driver already assigned to another trip");

    if (cargoKg > v.getMaxCapacityKg())
        errors.add("Capacity exceeded by " + (cargoKg - v.getMaxCapacityKg()) + " kg");

    return errors;  // empty == valid
}
```

Status side-effects are atomic — vehicle, driver and trip all flip in **one transaction**, so there is no window where the fleet is in an inconsistent state:

```java
@Transactional
public TripDto dispatch(Long tripId) {
    Trip trip = tripRepo.findById(tripId).orElseThrow();
    var errors = TripRules.validateDispatch(trip.getVehicle(), trip.getDriver(),
                                            trip.getCargoWeightKg());
    if (!errors.isEmpty()) throw new BusinessRuleException(errors);

    trip.setStatus(TripStatus.DISPATCHED);
    trip.getVehicle().setStatus(VehicleStatus.ON_TRIP);
    trip.getDriver().setStatus(DriverStatus.ON_TRIP);
    return TripMapper.toDto(trip);
}
```

> **Rules are enforced at the API layer, not just the UI.** Disabling the button in DevTools or calling `POST /api/trips/{id}/dispatch` directly still returns `400` with the same validation errors.

---

## 📦 Mandatory Deliverables

- [x] Responsive web interface
- [x] Authentication with Role-Based Access Control
- [x] CRUD for Vehicles and Drivers
- [x] Trip management with validations
- [x] Automatic status transitions
- [x] Maintenance workflow
- [x] Fuel & expense tracking
- [x] Dashboard with KPIs

## 🎁 Bonus Features

- [x] **Dark mode** (default theme)
- [x] **Charts & visual analytics** — Recharts: monthly revenue, top costliest vehicles
- [x] **Search, filters and sorting** across every table
- [x] **CSV export** on all reports
- [x] **Licence expiry alerts** — drivers within 30 days of expiry flagged on the dashboard
- [ ] PDF export
- [ ] Vehicle document management
- [ ] Email reminders

---

## 🖥 Screens

| # | Screen | Highlights |
|---|---|---|
| 0 | **Login** | Role-scoped access, account lockout after 5 failed attempts |
| 1 | **Dashboard** | 7 KPI cards, filters (type / status / region), recent trips, fleet status breakdown |
| 2 | **Vehicle Registry** | Unique reg-no enforcement, status lifecycle, capacity in kg |
| 3 | **Drivers & Safety** | Licence expiry tracking, safety score, trip completion %, status toggle |
| 4 | **Trip Dispatcher** ⭐ | Live validation, capacity checks, disabled dispatch on violation, live board |
| 5 | **Maintenance** | Service log → auto `In Shop`, close → auto `Available` |
| 6 | **Fuel & Expenses** | Fuel logs, tolls, misc. Auto total operational cost = Fuel + Maintenance |
| 7 | **Analytics** | Fuel efficiency, fleet utilisation, operational cost, vehicle ROI |
| 8 | **Settings** | Depot config, currency, distance unit, RBAC permission matrix |

<!-- Add screenshots here -->
<!-- ![Trip Dispatcher](docs/screenshots/dispatcher.png) -->

### ⭐ Trip Dispatcher — the core of the product

Validation runs **as you type**, before you can even submit:

```
Vehicle Capacity: 500 kg
Cargo Weight:     700 kg
✗ Capacity exceeded by 200 kg — dispatch blocked
```

The **Dispatch** button stays disabled until every rule passes. Vehicle and driver dropdowns are pre-filtered — `Retired`, `In Shop`, `On Trip` and `Suspended` entities never even appear as options.

---

## 🧱 Architecture

Organised **by feature**, not by layer — each module is self-contained, so four people can work in parallel with near-zero merge conflicts.

### Backend — Spring Boot

```
com.transitops
├── core/
│   ├── enums/          VehicleStatus · DriverStatus · TripStatus · MaintenanceStatus · Role
│   ├── rules/          TripRules · StatusMachine          ← all 10 business rules
│   ├── security/       JwtService · JwtFilter · SecurityConfig
│   ├── exception/      BusinessRuleException · GlobalExceptionHandler
│   └── config/         CorsConfig
├── modules/
│   ├── auth/           Controller · Service · dto/
│   ├── vehicle/        Entity · Repository · Service · Controller · dto/
│   ├── driver/
│   ├── trip/
│   ├── maintenance/
│   ├── fuel/
│   ├── expense/
│   └── analytics/
└── seed/               DataSeeder (CommandLineRunner)
```

**Design decisions**
- **Unidirectional JPA relations only** (`@ManyToOne`, no reverse `@OneToMany`) — no Jackson recursion, no `LazyInitializationException`.
- **DTOs (Java records) on every response** — entities never leave the service layer.
- **`BusinessRuleException` → `GlobalExceptionHandler`** → consistent `{ ok: false, errors: [...] }` shape the frontend maps straight into the error panel.

### Frontend — React + TypeScript

```
src/
├── components/     StatusBadge · DataTable · Modal · KpiCard · AppShell
├── features/
│   ├── auth/       vehicles/    drivers/
│   ├── trips/      maintenance/ fuel/
│   └── analytics/  settings/
├── types/          enums.ts — mirrors backend enums exactly
├── lib/            apiClient.ts · queryClient.ts
└── hooks/
```

**TanStack Query** handles server state — dispatching a trip automatically invalidates and refetches the dashboard KPIs, so the fleet counters update live without a manual refresh.

---

## 🗄 Data Model

```
User ──< Role                      Vehicle ──< MaintenanceLog
                                   Vehicle ──< FuelLog
Trip >── Vehicle                   Trip    ──< Expense
Trip >── Driver
```

| Entity | Key fields |
|---|---|
| **Vehicle** | `regNo` *(unique)*, name, type, `maxCapacityKg`, odometer, acquisitionCost, `region`, status |
| **Driver** | name, licenseNo, licenseCategory, `licenseExpiry`, contact, safetyScore, status |
| **Trip** | source, destination, vehicle, driver, `cargoWeightKg`, plannedDistanceKm, `revenue`, finalOdometer, fuelConsumed, status |
| **MaintenanceLog** | vehicle, serviceType, cost, date, status *(Active / Closed)* |
| **FuelLog** | vehicle, date, litres, cost |
| **Expense** | trip, vehicle, toll, other |

### Notable schema decisions

| Decision | Why |
|---|---|
| **All capacities stored in kilograms** | The registry mixes `500 kg` and `5 Ton`. Storing raw numbers would make a 5-tonne truck reject a 450 kg load. One canonical unit; formatting happens at the view layer. |
| **`Trip.revenue` added** | Vehicle ROI = `(Revenue − (Maintenance + Fuel)) / Acquisition Cost`. Revenue appears in the ROI formula and the monthly-revenue chart but was absent from the entity list — the metric is uncomputable without it. |
| **`Vehicle.region` added** | The dashboard specifies a region filter; no entity carried the field. |
| **Role named `DISPATCHER`, not `DRIVER`** | The spec's user list describes a "Driver" who *"creates trips, assigns vehicles and drivers"* — that's a dispatcher's job, and the login mockup confirms `Dispatcher`. |
| **Trip statuses restricted to `DRAFT / DISPATCHED / COMPLETED / CANCELLED`** | `On Trip` is a *vehicle and driver* status, not a trip status. The mockup's dashboard shows it in a trip column; we followed the spec's lifecycle instead. |

---

## 🔌 API Reference

All routes are prefixed `/api` and require `Authorization: Bearer <token>` except `/auth/login`.

### Auth
```http
POST   /auth/login                → { token, user: { id, name, email, role } }
GET    /auth/me
```

### Vehicles
```http
GET    /vehicles                  ?type=&status=&region=&q=
GET    /vehicles/available        → dispatch-eligible only (excludes Retired/In Shop/On Trip)
GET    /vehicles/{id}
POST   /vehicles
PUT    /vehicles/{id}
DELETE /vehicles/{id}
```

### Drivers
```http
GET    /drivers                   ?status=&q=
GET    /drivers/available         → dispatch-eligible only (valid licence, not Suspended/On Trip)
GET    /drivers/expiring          → licences expiring within 30 days
POST   /drivers
PUT    /drivers/{id}
PATCH  /drivers/{id}/status
```

### Trips
```http
GET    /trips                     ?status=
POST   /trips                     → creates in DRAFT
POST   /trips/{id}/validate       → dry-run; returns { ok, errors[] }
POST   /trips/{id}/dispatch       → 400 + errors[] if any rule fails
POST   /trips/{id}/complete       body: { finalOdometer, fuelConsumed }
POST   /trips/{id}/cancel
```

### Maintenance · Fuel · Expenses
```http
GET    /maintenance
POST   /maintenance               → vehicle auto-flips to IN_SHOP
POST   /maintenance/{id}/close    → vehicle auto-flips to AVAILABLE (unless RETIRED)
GET    /fuel-logs
POST   /fuel-logs
GET    /expenses
POST   /expenses
```

### Analytics
```http
GET    /analytics/kpis            → active/available/in-shop vehicles, trips, drivers on duty, utilisation %
GET    /analytics/fuel-efficiency → km per litre
GET    /analytics/operational-cost
GET    /analytics/vehicle-roi
GET    /analytics/revenue?months=7
GET    /analytics/export.csv
```

### Error shape
```json
{
  "ok": false,
  "errors": [
    "Capacity exceeded by 200 kg",
    "Driver licence expired on 2025-03-31"
  ]
}
```

---

## 🚀 Local Setup

### Prerequisites
- **Java 21** (or 17)
- **Node 20+**
- **PostgreSQL 15+** (or a free [Neon](https://neon.tech) instance)

### 1. Database
```bash
createdb transitops
```

### 2. Backend
```bash
cd server
cp .env.example .env        # fill in DB credentials + JWT secret
./mvnw spring-boot:run
```
→ API on **http://localhost:8080**

Seed data loads automatically on first boot (`DataSeeder`).

**`server/.env`**
```env
DB_URL=jdbc:postgresql://localhost:5432/transitops
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=change-me-to-a-long-random-string
JWT_EXPIRY_MS=86400000
CORS_ORIGINS=http://localhost:5173
```

### 3. Frontend
```bash
cd client
npm install
npm run dev
```
→ App on **http://localhost:5173**

**`client/.env`**
```env
VITE_API_URL=http://localhost:8080/api
```

### Reset the demo data
```bash
cd server && ./mvnw spring-boot:run -Dspring-boot.run.arguments=--app.seed.reset=true
```

---

## 🎬 Demo Script

Mirrors **Section 5** of the problem statement, end to end.

| Step | Action | Expected |
|---|---|---|
| 1 | Vehicle `VAN-05` registered, capacity 500 kg | Status **Available** |
| 2 | Driver `Alex` registered, licence valid to 12/2028 | Status **Available** |
| 3 | Create trip, cargo **700 kg** | 🔴 *"Capacity exceeded by 200 kg"* — **Dispatch disabled** |
| 4 | Change cargo to **450 kg** | ✅ Validation clears, Dispatch enabled → dispatch |
| 5 | — | Vehicle **and** driver both flip to **On Trip** |
| 6 | Complete trip: final odometer + fuel consumed | — |
| 7 | — | Both revert to **Available** |
| 8 | Log maintenance (Oil Change) on `VAN-05` | Vehicle → **In Shop**, disappears from dispatch dropdown |
| 9 | Open Analytics | Operational cost and fuel efficiency reflect the new trip + fuel log |

### Rule-breaking scenarios (seeded and ready)

| Try this | Result |
|---|---|
| Assign driver **John** *(licence expired 03/2025)* | 🚫 Blocked — not even in the dropdown |
| Assign driver **Priya** *(already On Trip)* | 🚫 Blocked |
| Dispatch **MINI-03** *(In Shop)* | 🚫 Not in dispatch pool |
| Dispatch **VAN-09** *(Retired)* | 🚫 Not in dispatch pool |
| `POST /api/trips/1/dispatch` via Postman, bypassing the UI | 🚫 `400` + the same `errors[]` |

---

## 🎨 Design System

Dark-first UI. Status colour is **consistent across every screen** — one `<StatusBadge>` component, one source of truth.

| Colour | Vehicle | Driver | Trip / Maintenance |
|---|---|---|---|
| 🟢 Green | Available | Available | Completed |
| 🔵 Blue | On Trip | On Trip | Dispatched |
| 🟠 Orange | In Shop | Suspended | Active |
| 🔴 Red | Retired | — | Cancelled |
| ⚪ Grey | — | Off Duty | Draft |

Accent: **amber** for primary actions. Layout: fixed sidebar + top bar with global search and role chip.

---

## 🛠 Tech Stack

| Layer | Choice | Why |
|---|---|---|
| **Backend** | Spring Boot 3, Java 21 | `@Transactional` gives atomic multi-entity status transitions for free |
| **ORM** | Spring Data JPA / Hibernate | Dirty-checking keeps the status machine terse |
| **DB** | PostgreSQL (Neon) | Same engine locally and in production — no dialect surprises |
| **Auth** | Spring Security 6 + JWT | Stateless, role claims in the token |
| **Frontend** | React 19 + TypeScript + Vite | Type-safe enums shared with backend contract |
| **Styling** | Tailwind CSS | Fast iteration on the dark theme |
| **Server state** | TanStack Query | Automatic cache invalidation → live KPI updates |
| **Charts** | Recharts | Declarative, small, good defaults |
| **Deploy** | Vercel (web) · Railway (API) · Neon (DB) | — |

---

## 📄 Licence

MIT