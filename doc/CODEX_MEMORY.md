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
