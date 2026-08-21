# MetricLink

**MetricLink** is a URL shortener with click metrics tracking. The project lets you create short links with an expiration date, redirect visitors to the original URL, and view access statistics.

This repository is a **monorepo**: the frontend and backend live in the same Git repository, but they are independent applications with their own dependencies, scripts, and development workflow.

---

## Live demo

| Layer    | URL                                                                 |
|----------|---------------------------------------------------------------------|
| Frontend | **https://metric-link.vercel.app/** (Vercel)                        |
| Backend  | **https://metriclink.duckdns.org** (Oracle Cloud VM — Ubuntu 24)    |
| API docs | **https://metriclink.duckdns.org/docs**                             |

---

## Table of contents

- [Live demo](#live-demo)
- [Overview](#overview)
- [Monorepo structure](#monorepo-structure)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [REST API](#rest-api)
- [Tests](#tests)
- [CI/CD](#cicd)

---

## Overview

Typical flow:

1. The user enters a long URL and an expiration date in the frontend.
2. The backend generates a random **slug**, persists it in PostgreSQL, and returns the short link.
3. When visiting `https://metriclink.duckdns.org/{slug}`, the backend redirects and records the click.
4. The frontend shows charts and totals by calling the metrics endpoints.

---

## Monorepo structure

```
MetricLink/
├── FrontEnd/                        # React application (SPA)
│   ├── src/
│   │   ├── components/              # UrlForm, UrlCard, Sidebar, MetricsChart, UserComponent
│   │   ├── pages/                   # Landing, Home, Metrics, Login, Register
│   │   ├── services/                # HTTP client (axios) for the API
│   │   ├── types/                   # Shared TypeScript types
│   │   ├── utils/                   # Utility helpers (e.g. date formatting)
│   │   ├── App.tsx                  # Application routes
│   │   └── main.tsx                 # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── BackEnd/                         # Python API (FastAPI)
│   ├── src/
│   │   ├── domain/                  # Entities (Url, User), exceptions and contracts (repositories)
│   │   ├── application/
│   │   │   └── use_cases/
│   │   │       ├── url/             # CreateUrl, RedirectUrl, GetMetrics, GetUrlsByUser, DeleteUrl
│   │   │       └── user/            # Login, Register
│   │   └── infrastructure/          # HTTP, database, cache, auth — concrete implementations
│   │       ├── http/
│   │       │   ├── dependencies.py  # FastAPI dependency providers (DI)
│   │       │   ├── url_router.py
│   │       │   └── user_router.py
│   │       ├── database/            # PostgreSQL repositories
│   │       ├── cache/               # Redis (CacheService)
│   │       └── auth/                # JWT service
│   ├── tests/
│   │   ├── fake/                    # In-memory fakes for unit tests
│   │   ├── integration/             # Integration tests (PostgreSQL, Redis, API)
│   │   └── test_*.py                # Unit tests for use cases and domain
│   ├── run.ps1                      # Start the API locally (Windows)
│   ├── requirements.txt
│   └── .env.exemple                 # Environment variables template
│
├── .github/workflows/               # CI pipeline (GitHub Actions)
└── README.md                        # This file
```

---

## Technologies

### Frontend (`FrontEnd/`)

| Technology       | Usage                                              |
|------------------|----------------------------------------------------|
| **React 19**     | Component-based user interface                     |
| **TypeScript**   | Static typing                                      |
| **Vite**         | Bundler and dev server (HMR)                       |
| **React Router** | Routing (`/` and `/metrics/:slug`)                 |
| **Axios**        | HTTP calls to the API                              |
| **Recharts**     | Grapich Metrics                                    |
| **ESLint**       | TypeScript/React linting                           |

Deployed at **https://metric-link.vercel.app/** via [Vercel](https://vercel.com/).

### Backend (`BackEnd/`)

| Technology         | Usage                                              |
|--------------------|----------------------------------------------------|
| **Python 3.12+**   | API language                                       |
| **FastAPI**        | Web framework and auto-generated docs (OpenAPI)    |
| **Uvicorn**        | ASGI server                                        |
| **Pydantic**       | Request/response schema validation                 |
| **PostgreSQL**     | Persistence for URLs and click metrics             |
| **psycopg**        | PostgreSQL driver                                  |
| **Redis**          | Redirect cache (slug → original URL)               |
| **pytest**         | Automated tests                                    |
| **testcontainers** | Integration tests with real PostgreSQL and Redis   |
| **Ruff**           | Python linter                                      |

Deployed at **https://metriclink.duckdns.org** on an Oracle Cloud free-tier VM.

---

## Architecture

### Backend — Clean Architecture (layers)

The backend follows **Clean Architecture** in layers: business rules at the center, use cases in the application layer, and technical details (HTTP, PostgreSQL, Redis) in infrastructure. It applies **Clean Code** principles: dependencies point inward, each use case has a single responsibility, and the domain does not know about FastAPI or the database.

```
┌─────────────────────────────────────────────────────────────┐
│  infrastructure/http        FastAPI, DI providers, schemas  │
│  infrastructure/database    PostgreSQL repositories         │
│  infrastructure/cache       Redis (CacheService)            │
│  infrastructure/auth        JWT service                     │
└───────────────────────────┬─────────────────────────────────┘
                            │ depends on
┌───────────────────────────▼─────────────────────────────────┐
│  application/use_cases/url  CreateUrl, RedirectUrl,         │
│                             GetMetrics, GetUrlsByUser,      │
│                             DeleteUrl                       │
│  application/use_cases/user Login, Register                 │
└───────────────────────────┬─────────────────────────────────┘
                            │ depends on
┌───────────────────────────▼─────────────────────────────────┐
│  domain/                    Url, User (entities),           │
│                             UrlRepository, MetricRepository,│
│                             UserRepository, exceptions      │
└─────────────────────────────────────────────────────────────┘
```

**Main use cases:**

| Use case         | Responsibility                                                                 |
|------------------|--------------------------------------------------------------------------------|
| `CreateUrl`      | Generates a secure slug, caps expiration at 30 days, and saves the URL         |
| `RedirectUrl`    | Reads Redis cache; if missing, queries the DB, validates expiration, caches    |
| `GetMetrics`     | Total clicks, clicks per day, and history                                      |
| `GetUrlsByUser`  | Returns all URLs created by an authenticated user                              |
| `DeleteUrl`      | Removes a URL by slug                                                          |
| `Register`       | Creates a new user account with a hashed password                              |
| `Login`          | Validates credentials and issues a JWT access token                            |

In the domain, contracts such as `UrlRepository` and `UserRepository` enable **dependency inversion**; entities expose behavior (`Url.is_expired()`), and business errors become typed exceptions (`UrlNotFoundError`, `ExpiredUrlError`, `UserNotFoundError`, `InvalidCredentialsError`).

At the HTTP layer, **dependency injection** is handled by FastAPI: `BackEnd/src/infrastructure/http/dependencies.py` exposes provider functions (`get_url_repository`, `get_metric_repository`, `get_cache`, `get_user_repository`, `get_current_user`), and routes in `url_router.py` and `user_router.py` receive them via `Depends(...)`. This keeps use cases decoupled from concrete implementations and allows integration tests to override dependencies with real PostgreSQL/Redis instances through `app.dependency_overrides`.

Authentication uses **JWT** tokens (issued at login, validated by `get_current_user`). URL creation also accepts unauthenticated requests via `get_optional_user`.

Unit tests use **fakes** in `BackEnd/tests/fake/` with the same interfaces as production.

**Persistence:** the script `BackEnd/src/infrastructure/database/schema.sql` defines the `urls`, `metrics`, and `users` tables.

**Cache:** on each successful redirect, the original URL is stored in Redis with a TTL until the link expires, reducing PostgreSQL queries.

### Frontend — SPA with routing

- **`/` (Landing):** public landing page.
- **`/home` (Home):** form to shorten URLs, sidebar with created links, and a card with the selected link details. Requires authentication.
- **`/metrics/:slug` (Metrics):** metrics page with totals, per-day list, and chart (Recharts).
- **`/login` (Login):** user login form.
- **`/register` (Register):** user registration form.

The backend is accessed via `FrontEnd/src/services/api.ts`, which points to `https://metriclink.duckdns.org`.

---

## Deployment

The production setup uses an **Oracle Cloud free-tier VM** for the backend and **Vercel** for the frontend.

### Infrastructure overview

```
Browser
   │
   ├── https://metric-link.vercel.app     → Vercel (React SPA)
   │                                           │
   │                                           │ API calls
   │                                           ▼
   └── https://metriclink.duckdns.org     → Oracle VM (Ubuntu 24)
                                               ├── Nginx (reverse proxy + TLS)
                                               ├── Uvicorn / FastAPI
                                               ├── PostgreSQL
                                               └── Redis
```

## REST API

Full interactive documentation at **https://metriclink.duckdns.org/docs**.

---

## Tests

Tests cover the entire **backend** and are split into two layers:

- **Unit tests** — exercise the domain and use cases in memory, without PostgreSQL, Redis, or the API.
- **Integration tests** — spin up real PostgreSQL and Redis instances via [Testcontainers](https://testcontainers.com/) 
and validate repositories, cache, and HTTP endpoints end-to-end.

### Fakes (unit tests)

Instead of mocking external libraries, unit tests use **fakes** — simple implementations of repository contracts:

- `FakeUrlRepository` stores URLs in a dictionary (`slug → Url`).
- `FakeMetricRepository` accumulates clicks in memory.
- `FakeCacheService` simulates get/set/delete without Redis.
- `FakeUserRepository` stores users in memory for auth use case tests.

This keeps tests fast, deterministic, and aligned with Clean Architecture: the use case receives the same interface it would use in production.

Integration tests override FastAPI dependencies (`app.dependency_overrides`) to wire real repository and cache implementations backed by Testcontainers.

---

## CI/CD

The workflow in `.github/workflows/ci.yml` runs on push/PR to the `main` and `develop` branches:

1. Code checkout
2. Python 3.12
3. Install `BackEnd/requirements.txt`
4. **Ruff** (`ruff check .`)
5. **pytest** (working directory: `BackEnd`)

The frontend is continuously deployed by Vercel on every push to `main`.

---
