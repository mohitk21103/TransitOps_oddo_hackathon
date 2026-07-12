# TransitOps — Smart Transport Operations Platform

A centralized platform to manage the full lifecycle of transport operations —
vehicles, drivers, dispatch, maintenance, fuel/expenses, and analytics — with
business-rule enforcement and operational insights.

> **Status: skeleton.** Auth (JWT + RBAC), environment config, and the app
> structure are in place. Business modules are stubbed pending the database
> schema.

## Tech stack

| Layer     | Stack                                                        |
|-----------|-------------------------------------------------------------|
| Backend   | Java 21, Spring Boot 4, Spring Security (JWT), Spring Data JPA, PostgreSQL |
| Frontend  | React 18, TypeScript, Vite, React Router, Axios             |
| Auth      | Stateless JWT (HS256), Role-Based Access Control             |

## Repository layout

```
transitops/
├── backend/                     # Spring Boot API
│   └── src/main/java/com/transitops/
│       ├── config/              # SecurityConfig, SecurityProperties (JWT + CORS)
│       ├── security/            # JWT filter, entry point, RBAC roles, user store
│       ├── util/                # JwtUtil — token creation/validation (secret lives here)
│       ├── controller/          # AuthController (/api/auth/**)
│       ├── dto/                 # request/response records + ApiResponse envelope
│       └── exception/           # GlobalExceptionHandler + ApiError
│   └── src/main/resources/
│       ├── application.yml       # base config
│       ├── application-local.yml # local Postgres (default profile)
│       ├── application-prod.yml  # prod — everything from env vars
│       └── application-dev-h2.yml# in-memory DB, no Postgres needed
└── frontend/                    # React + Vite SPA
    └── src/
        ├── api/                 # axios client (JWT interceptor) + endpoints
        ├── auth/                # AuthContext, ProtectedRoute (RBAC)
        ├── components/          # Layout / shell
        └── pages/               # Login, Dashboard, module placeholders
```

## Environment configuration

Config is profile-based and **env-var overridable** — the same artifact runs in
every environment. Copy the examples and adjust:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

| Variable | Purpose | Default |
|----------|---------|---------|
| `SPRING_PROFILES_ACTIVE` | `local` \| `prod` \| `dev-h2` | `local` |
| `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` | PostgreSQL connection | local Postgres |
| `JWT_SECRET` | HS256 signing secret (**set in prod!**) | dev-only value |
| `JWT_EXPIRATION_MS` | Access-token lifetime | `3600000` (1h) |
| `CORS_ALLOWED_ORIGINS` | Allowed SPA origins | `http://localhost:5173` |

Databases:
- **Local Postgres:** `jdbc:postgresql://localhost:5432/transitops`
- **Team/remote Postgres:** `jdbc:postgresql://72.60.205.221:5432/transitops`
  (`psql -h 72.60.205.221 -U transitops -d transitops`)

## Running

### Backend
```bash
cd backend
./mvnw spring-boot:run                                   # local profile (needs Postgres)
SPRING_PROFILES_ACTIVE=dev-h2 ./mvnw spring-boot:run     # no Postgres required
```
API runs on **http://localhost:4000**.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
SPA runs on **http://localhost:5173** (proxies `/api` → backend).

## Auth quick start

Demo accounts (in-memory until the Users/Roles schema lands) — password `password`:

| Email | Role |
|-------|------|
| admin@transitops.com | ADMIN |
| manager@transitops.com | MANAGER |
| dispatcher@transitops.com | DISPATCHER |
| viewer@transitops.com | VIEWER |

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@transitops.com","password":"password"}'
```

Send the returned token as `Authorization: Bearer <token>` on protected routes.
Use `@PreAuthorize("hasRole('ADMIN')")` on handlers for fine-grained RBAC.

## Next steps
- Define the DB schema (Users, Roles, Vehicles, Drivers, Trips, Maintenance Logs,
  Fuel Logs, Expenses) and add JPA entities + repositories.
- Swap the in-memory user store (`AppUserDetailsService`) for a JPA-backed one.
- Implement module CRUD + the workflow rules (unique registration, license/expiry
  checks, dispatch conflicts, cargo-capacity, status transitions).
- Wire dashboard KPIs and reports (fuel efficiency, utilization, ROI, CSV export).
