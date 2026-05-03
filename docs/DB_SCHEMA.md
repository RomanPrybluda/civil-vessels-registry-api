# Database Schema

Актуализировано по состоянию на `2026-05-03` на основе:
- прикладной схемы из `prisma/schema.prisma`;
- предоставленного снимка текущей auth-схемы БД.

## 1) Прикладная схема (`public`, Prisma)

### Справочники
- `Manufacturer`: производители (`name` unique), связан с судами и оборудованием.
- `ClassificationSociety`: классификационные общества (`name` unique, `shortName` unique), связан с судами.
- `Shipbuilder`: судостроители (`name` unique), связан с судами.

### Основная сущность
- `Vessel`:
  - идентификация: `id`, `name`, `imoNumber` (unique), `vesselType`, `builtYear`;
  - параметры: `length`, `breadth`, `depth`, `draft`, `deadweight`, `grossTonnage`, `iceClass`;
  - связи: `classificationSocietyId`, `manufacturerId`, `shipbuilderId`;
  - индексы: `imoNumber`, `vesselType`, `builtYear`, `manufacturerId`, `shipbuilderId`.

### Энергетическое оборудование
- `VesselMainEngine`
- `VesselAuxiliaryEngine`
- `VesselShaftGenerator`

Для всех трех таблиц:
- связь с `Vessel` через `vesselId` (`onDelete: Cascade`);
- связь с `Manufacturer` через `manufacturerId` (`onDelete: SetNull`);
- поля: `model`, `quantity`, `powerKw`, `totalPowerKw`, `createdAt`, `updatedAt`.

### Упрощенная диаграмма связей (прикладная часть)

```text
ClassificationSociety 1 --- N Vessel N --- 1 Manufacturer
                              |
                              N
                              |
                          1 Shipbuilder

Vessel 1 --- N VesselMainEngine
Vessel 1 --- N VesselAuxiliaryEngine
Vessel 1 --- N VesselShaftGenerator
```

## 2) Auth-схема (управляется Supabase/Auth)

Ниже таблицы, которые присутствуют в актуальной БД для аутентификации/SSO/OAuth/MFA/сессий.

### Аудит и системные
- `audit_log_entries`
- `instances`
- `schema_migrations`

### Пользователи, идентичности, сессии и токены
- `users`
- `identities`
- `sessions`
- `refresh_tokens`
- `one_time_tokens`

### MFA и WebAuthn
- `mfa_factors`
- `mfa_challenges`
- `mfa_amr_claims`
- `webauthn_challenges`
- `webauthn_credentials`

### OAuth и внешние провайдеры
- `oauth_clients`
- `oauth_authorizations`
- `oauth_consents`
- `oauth_client_states`
- `custom_oauth_providers`
- `flow_state`

### SSO / SAML
- `sso_providers`
- `sso_domains`
- `saml_providers`
- `saml_relay_states`

## 3) Ключевые ограничения в auth-контуре

- Первичные ключи: во всех перечисленных auth-таблицах.
- Уникальные поля (критичные):
  - `custom_oauth_providers.identifier`
  - `oauth_authorizations.authorization_id`
  - `oauth_authorizations.authorization_code`
  - `saml_providers.entity_id`
  - `mfa_factors.last_challenged_at`
  - `refresh_tokens.token`
  - `users.phone`
- Большая часть auth-таблиц использует `uuid` как основной тип идентификаторов.

## 4) Граница ответственности

- `public`/Prisma-часть (суда и справочники) поддерживается кодом этого API.
- `auth`-контур (таблицы выше) считается инфраструктурным и управляется Supabase/Auth миграциями.
