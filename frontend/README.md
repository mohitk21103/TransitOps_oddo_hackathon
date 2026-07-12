# TransitOps — Frontend

Smart Transport Operations Platform. React + Vite + TypeScript + Tailwind CSS.

## Getting started

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at the backend
npm run dev            # http://localhost:5173
```

Scripts: `npm run dev` · `npm run build` · `npm run preview` · `npm run lint`

## Tech stack

| Concern          | Choice                            |
| ---------------- | --------------------------------- |
| Framework        | React 19 + Vite                   |
| Language         | TypeScript (strict)               |
| Styling          | Tailwind CSS v4 (class dark mode) |
| Routing          | React Router                      |
| Server state     | TanStack Query                    |
| Client state     | Zustand                           |
| Forms/validation | React Hook Form + Zod             |
| HTTP             | Axios (interceptors)              |
| Icons            | lucide-react                      |

## Architecture

Feature-based (feature-sliced) structure. Each feature owns its types, API,
hooks, components and pages, and exposes a public surface via `index.ts`.
Shared, cross-cutting concerns live outside `features/`.

```
src/
├── app/                  # composition root
│   ├── App.tsx
│   ├── router.tsx        # route table + guards
│   └── providers/        # Query, Router, AuthBootstrap
├── components/
│   ├── ui/               # design-system primitives (Button, Card, Badge…)
│   └── layout/           # AppLayout, Sidebar, Topbar, nav config
├── config/               # env + constants
├── features/             # domain modules
│   ├── auth/             # RBAC: roles, login, ProtectedRoute
│   ├── dashboard/        # KPI overview
│   ├── vehicles/         # vehicle registry
│   ├── drivers/          # driver management + license tracking
│   ├── trips/            # trip lifecycle (draft→dispatched→completed)
│   ├── maintenance/      # service records
│   ├── fuel/             # fuel logs & expenses
│   └── reports/          # analytics + CSV export
│       ├── api/          # resource client
│       ├── hooks/        # TanStack Query hooks + query keys
│       ├── components/   # feature-scoped UI
│       ├── pages/        # routed screens
│       ├── types.ts      # domain types + enums
│       └── index.ts      # public surface
├── hooks/                # shared hooks
├── lib/
│   ├── api/              # axios client + CRUD factory
│   └── utils/            # cn, formatters, csv
├── routes/               # centralized path registry
├── stores/               # zustand stores (auth, theme)
└── types/                # cross-cutting types
```

### Conventions

- **Imports** use the `@/` alias for `src/` (see `vite.config.ts` / `tsconfig.app.json`).
- **Domain enums** are `const` objects + derived union types (no TS `enum`).
- **Data fetching** goes through TanStack Query hooks keyed by a `*Keys`
  factory; mutations invalidate the relevant keys. Trip and maintenance
  transitions cascade to vehicle and driver caches to reflect automatic status
  changes.
- **API access** never touches `axios` directly — features call their own
  `*Api` module built on `createCrudApi`.
- **Errors** are normalized to `AppError` by the response interceptor.
- **RBAC** is enforced by `ProtectedRoute` and reflected in the sidebar.
