# Civil Vessels Registry API

Backend API for a civil cargo vessels registry.  
The project is built with NestJS + Prisma + PostgreSQL and provides CRUD operations for vessels, manufacturers, and classification societies.

## Production

- API: https://civil-vessels-registry-api.vercel.app/
- Swagger UI: https://civil-vessels-registry-api.vercel.app/api/docs/
- Healthcheck: https://civil-vessels-registry-api.vercel.app/health

## Key Features

- Vessel registry with IMO number, type, tonnage, dimensions, and build year.
- Reference directories for manufacturers and classification societies.
- Search, filtering, sorting, and pagination for vessel lists.
- JWT authentication and role-based authorization (`admin`, `manager`, `user`).
- Input validation and Swagger API documentation.

## API Modules

- `auth`:
  - `POST /auth/login` - get JWT token
  - `GET /auth/me` - get current authenticated user
- `vessels`:
  - `GET /vessels`, `GET /vessels/:id`, `GET /vessels/imo/:imoNumber`
  - `POST /vessels`, `PUT /vessels/:id`, `DELETE /vessels/:id`
- `manufacturers`:
  - `GET /manufacturers`, `GET /manufacturers/:id`
  - `POST /manufacturers`, `PUT /manufacturers/:id`, `DELETE /manufacturers/:id`
- `classification-societies`:
  - `GET /classification-societies`, `GET /classification-societies/:id`
  - `POST /classification-societies`, `PUT /classification-societies/:id`, `DELETE /classification-societies/:id`
- `health`:
  - `GET /health`

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

Optional:

- `JWT_EXPIRES_IN` (default: `1h`)
- `AUTH_USERS_JSON` (JSON array of local users)
- `NODE_ENV=production`

## Tests and Useful Commands

```bash
npm run test
npm run test:e2e
npm run test:cov
```

