# CODEX Memory

## 2026-05-03

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
