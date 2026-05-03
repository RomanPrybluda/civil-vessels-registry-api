# CODEX Memory

## 2026-05-03

### UI: Swagger tab title shortened
- Replaced default browser tab title `Swagger UI` with short resource name `CVR API` using `customSiteTitle` in Swagger setup.

### Feature: Vessel types directory and vessel FK migration
- Added `VesselType` model and migration to normalize vessel types into a dedicated table.
- Migrated `Vessel` from string field `vesselType` to required FK `vesselTypeId`.
- Added full CRUD module `vessel-types` (`/vessel-types` endpoints).
- Updated vessels create/update flow to validate `vesselTypeId` existence.
- Updated vessel list filtering/sorting/search to work through the linked vessel type entity.
- Refreshed seed and docs to keep schema/API/seed consistency.

### Feature: Shipbuilders entity and vessel relation
- Added `Shipbuilder` model and migration.
- Added `shipbuilderId` relation field to `Vessel`.
- Added full CRUD module `shipbuilders` (`/shipbuilders` endpoints).
- Added shipbuilder checks and mapping in vessels service/repository/DTOs.

### Data: Seed refresh
- Replaced old small seed dataset.
- Seed now inserts:
  - 20 vessels of different vessel types
  - 5 manufacturers
  - 5 shipbuilders
  - 5 classification societies
- Seed clears previous seeded records before insert.

### Security/Auth
- Removed fallback mock users from auth service.
- `AUTH_USERS_JSON` is now mandatory for login configuration.

### Docs/Process
- Added root `AGENTS.md`.
- Established this memory file for future feature/bug entries.

### Adjustment: direct vessel links
- Added direct `Vessel.manufacturerId` relation to `Manufacturer`.
- `Vessel` now has direct links to both:
  - `Manufacturer` via `manufacturerId`
  - `Shipbuilder` via `shipbuilderId`
- Confirmed no standalone `builders` entity/module exists.

### Validation: DTO hardening for entity creation
- Strengthened `class-validator` rules in create DTOs:
  - `CreateVesselDto`
  - `VesselEquipmentInputDto`
  - `CreateManufacturerDto`
  - `CreateShipbuilderDto`
  - `CreateClassificationSocietyDto`
- Added explicit max lengths, numeric upper bounds, URL protocol requirement, and array size limits.
- Kept Rich Model validation unchanged as a separate business-invariant layer.

### Refactor: unified API route structure
- Added global API prefix: all public endpoints now start with `/api`.
- Updated route aliases for reference modules:
  - `manufacturers` -> `/api/manufacturers`
  - `shipbuilders` -> `/api/shipbuilders`
  - `classification-societies` -> `/api/class-societies`
- Kept auth endpoints under `/api/auth`.
- Synchronized Swagger tags and `README.md` endpoint list with the new route structure.

### Feature: role matrix hardening for admin/manager/user
- Finalized supported roles to `admin`, `manager`, and `user`.
- Access policy updated:
  - `user`: read-only (public `GET` endpoints).
  - `manager`: create/update vessels only.
  - `admin`: full write access across all modules.
- Restricted write access on reference directories (`manufacturers`, `shipbuilders`, `class-societies`) to `admin` only.
- Restricted vessel deletion to `admin` only.
- Added regression test `src/modules/auth/authorization-matrix.spec.ts` to lock role metadata for protected controller methods.
- Updated `README.md` with the new authorization matrix and `AUTH_USERS_JSON` example for all three roles.

### Cleanup: remove legacy Hello World endpoint
- Removed root `GET /api` Hello World endpoint by deleting:
  - `src/app.controller.ts`
  - `src/app.service.ts`
  - `src/app.controller.spec.ts`
- Updated e2e test to validate `GET /api/health` response shape instead of the removed root route.
- Kept `GET /api/health` as the public liveness endpoint.

### Feature: production-ready healthcheck with DB dependency
- Updated `GET /api/health` to include an actual database ping (`SELECT 1`) through Prisma.
- Health response now includes dependency checks (`checks.database`).
- Endpoint returns `200` with `database: up` when DB is reachable.
- Endpoint returns `503 Service Unavailable` with `database: down` when DB is unreachable.
- Updated e2e coverage for both healthy and degraded DB states.
- Updated `README.md` health module description to document the DB-aware behavior.

### Docs: internal knowledge base in `docs/`
- Added new folder `docs/` with navigation and operational project docs:
  - `docs/INDEX.md`
  - `docs/DB_SCHEMA.md`
  - `docs/MODULES_AND_FEATURES.md`
  - `docs/PROJECT_ERRORS.md`
- Documented:
  - Current Prisma DB schema and relationships.
  - API modules/features and role access model.
  - Historical project mistakes and rules to avoid repeating them.

### Docs: DB schema sync with actual auth contour
- Updated `docs/DB_SCHEMA.md` to reflect two-layer structure:
  - Application (`public`) schema from Prisma.
  - Auth infrastructure schema (Supabase/Auth tables).
- Added grouped auth table catalog and responsibility boundary between API-owned and infra-managed schema.

### Bugfix: Vercel bootstrap stability without auth env
- Fixed global app crash when `AUTH_USERS_JSON` is absent:
  - auth users are now loaded lazily on login request instead of module bootstrap.
  - app can boot and serve public/read endpoints even if auth env is missing in a preview deployment.
- `POST /api/auth/login` now returns `503 Service Unavailable` for missing/invalid auth runtime configuration instead of crashing the whole server.
- Added regression tests in `src/modules/auth/application/auth.service.spec.ts`.
- Fixed production runtime script paths:
  - `start` and `start:prod` now run `node dist/src/main.js`.

