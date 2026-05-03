# Civil Vessels Registry API

Backend API for a civil cargo vessels registry.  
The project is built with NestJS + Prisma + PostgreSQL and provides CRUD operations for vessels, manufacturers, shipbuilders, and class societies.

## Production

- API: https://civil-vessels-registry-api.vercel.app/
- Swagger UI: https://civil-vessels-registry-api.vercel.app/api/docs/
- Healthcheck: https://civil-vessels-registry-api.vercel.app/api/health

## Key Features

- Vessel registry with IMO number, type, tonnage, dimensions, and build year.
- Reference directories for manufacturers, shipbuilders, and class societies.
- Search, filtering, sorting, and pagination for vessel lists.
- JWT authentication and role-based authorization (`admin`, `manager`, `user`).
- Input validation and Swagger API documentation.

## API Modules

- `auth`:
  - `POST /api/auth/login` - get JWT token
  - `GET /api/auth/me` - get current authenticated user
- `vessels`:
  - `GET /api/vessels`, `GET /api/vessels/:id`, `GET /api/vessels/imo/:imoNumber`
  - `POST /api/vessels`, `PUT /api/vessels/:id`, `DELETE /api/vessels/:id`
- `manufacturers`:
  - `GET /api/manufacturers`, `GET /api/manufacturers/:id`
  - `POST /api/manufacturers`, `PUT /api/manufacturers/:id`, `DELETE /api/manufacturers/:id`
- `shipbuilders`:
  - `GET /api/shipbuilders`, `GET /api/shipbuilders/:id`
  - `POST /api/shipbuilders`, `PUT /api/shipbuilders/:id`, `DELETE /api/shipbuilders/:id`
- `class-societies`:
  - `GET /api/class-societies`, `GET /api/class-societies/:id`
  - `POST /api/class-societies`, `PUT /api/class-societies/:id`, `DELETE /api/class-societies/:id`
- `health`:
  - `GET /api/health` (liveness + database connectivity check; returns `503` if DB is down)

`GET` endpoints are public.
Write permissions:
- `user`: read-only access (`GET` endpoints).
- `manager`: can create and update vessels (`POST/PUT /api/vessels`).
- `admin`: full access to all write endpoints, including delete and reference directories.

## Local Run

```bash
npm install
npm run build
npm run start:dev
```

The application starts on `http://localhost:3000` by default.

## Environment Variables

Required:

- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `AUTH_USERS_JSON` (JSON array of users; mock defaults are removed)

Example:

```json
[
  { "id": "admin-1", "username": "admin", "password": "admin-pass", "role": "admin" },
  { "id": "manager-1", "username": "manager", "password": "manager-pass", "role": "manager" },
  { "id": "user-1", "username": "user", "password": "user-pass", "role": "user" }
]
```

Optional:

- `JWT_EXPIRES_IN` (default: `1h`)
- `NODE_ENV=production`

## Tests and Useful Commands

```bash
npm run test
npm run test:e2e
npm run test:cov
```

