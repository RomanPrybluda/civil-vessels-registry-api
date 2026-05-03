# Modules And Features

## Архитектурный срез

- Фреймворк: NestJS.
- Доступ к БД: Prisma + PostgreSQL.
- Глобальный префикс API: `/api`.
- Swagger: `/api/docs`.
- Базовый healthcheck: `/api/health` (включает проверку БД).

## Модули

### `auth`
- Эндпоинты:
  - `POST /api/auth/login`
  - `GET /api/auth/me`
- Назначение:
  - Аутентификация по JWT.
  - Выдача информации о текущем пользователе.
- Особенности:
  - Пользователи берутся из `AUTH_USERS_JSON`.
  - Роли: `admin`, `manager`, `user`.

### `vessels`
- Эндпоинты:
  - Публичные: `GET /api/vessels`, `GET /api/vessels/:id`, `GET /api/vessels/imo/:imoNumber`
  - Запись: `POST /api/vessels`, `PUT /api/vessels/:id`, `DELETE /api/vessels/:id`
- Назначение:
  - CRUD по судам.
  - Фильтрация/сортировка/пагинация.
  - Привязка судна к справочнику типов по `vesselTypeId`.
  - Хранение размерений и данных по энергетическому оборудованию.

### `vessel-types`
- Эндпоинты:
  - Публичные: `GET /api/vessel-types`, `GET /api/vessel-types/:id`
  - Запись: `POST/PUT/DELETE /api/vessel-types...`
- Назначение:
  - Справочник типов судов.

### `manufacturers`
- Эндпоинты:
  - Публичные: `GET /api/manufacturers`, `GET /api/manufacturers/:id`
  - Запись: `POST/PUT/DELETE /api/manufacturers...`
- Назначение:
  - Справочник производителей.

### `shipbuilders`
- Эндпоинты:
  - Публичные: `GET /api/shipbuilders`, `GET /api/shipbuilders/:id`
  - Запись: `POST/PUT/DELETE /api/shipbuilders...`
- Назначение:
  - Справочник судостроителей.

### `classification-societies`
- Эндпоинты:
  - Публичные: `GET /api/class-societies`, `GET /api/class-societies/:id`
  - Запись: `POST/PUT/DELETE /api/class-societies...`
- Назначение:
  - Справочник классификационных обществ.

### `health`
- Эндпоинт: `GET /api/health`
- Назначение:
  - Проверка liveness.
  - Проверка доступности БД.

## Матрица доступа

- `GET`-эндпоинты: публичные.
- `user`: только чтение.
- `manager`: запись только в `vessels` (`POST/PUT`).
- `admin`: полный доступ ко всем write-эндпоинтам, включая `DELETE` и справочники (`vessel-types`, `manufacturers`, `shipbuilders`, `class-societies`).

## Фичи, которые важно сохранять

- Строгая валидация DTO (явные ограничения, типы, лимиты).
- Согласованность API/DTO/Schema/Seed при любом изменении домена.
- Отсутствие mock-учеток в production-ready коде.
