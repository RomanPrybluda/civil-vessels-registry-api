# AGENTS

## Workflow

1. Create a dedicated branch for each feature or bug fix.
2. Implement changes with schema, API, docs, and seed consistency.
3. Record every completed feature/bug fix in `doc/CODEX_MEMORY.md`.
4. Open a Pull Request to `main`.

## Project Conventions

- Keep all API DTO validation strict and explicit.
- Keep read endpoints public and write endpoints role-protected.
- Keep `README.md` synchronized with production URLs and API modules.
- Avoid mock credentials and mock seed fragments in production-ready code.
