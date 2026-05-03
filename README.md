# Civil Vessels Registry API

Backend API for a civil cargo vessels registry.  
The project is built with NestJS + Prisma + PostgreSQL and provides CRUD operations for vessels, vessel types, builders, and class societies.

## Production

- API: https://civil-vessels-registry-api.vercel.app/
- Swagger UI: https://civil-vessels-registry-api.vercel.app/api/docs/
- Healthcheck: https://civil-vessels-registry-api.vercel.app/api/health

## Key Features

- Vessel registry with IMO number, type, tonnage, dimensions, and build year.
- Reference directories for vessel types, builders, and class societies.
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
- `vessel-types`:
  - `GET /api/vessel-types`, `GET /api/vessel-types/:id`
  - `POST /api/vessel-types`, `PUT /api/vessel-types/:id`, `DELETE /api/vessel-types/:id`
- `builders`:
  - `GET /api/builders`, `GET /api/builders/:id`
  - `POST /api/builders`, `PUT /api/builders/:id`, `DELETE /api/builders/:id`
- `class-societies`:
  - `GET /api/class-societies`, `GET /api/class-societies/:id`
  - `POST /api/class-societies`, `PUT /api/class-societies/:id`, `DELETE /api/class-societies/:id`
- `health`:
  - `GET /api/health`

`GET` endpoints are public. Data modification endpoints (`POST/PUT/DELETE`) require a `Bearer` token with `admin` or `manager` role.

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

Optional:

- `JWT_EXPIRES_IN` (default: `1h`)
- `NODE_ENV=production`

## Tests and Useful Commands

```bash
npm run test
npm run test:e2e
npm run test:cov
```

