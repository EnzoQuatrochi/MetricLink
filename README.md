# MetricLink

**MetricLink** is a URL shortener with click metrics tracking. The project lets you create short links with an expiration date, redirect visitors to the original URL, and view access statistics (total clicks and per-day history).

This repository is a **monorepo**: the frontend and backend live in the same Git repository, but they are independent applications with their own dependencies, scripts, and development workflow.

---

## Table of contents

- [Overview](#overview)
- [Monorepo structure](#monorepo-structure)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Running the project](#running-the-project)
- [REST API](#rest-api)
- [Tests](#tests)
- [CI/CD](#cicd)

---

## Overview

| Layer    | Folder      | Main role                                           |
|----------|-------------|-----------------------------------------------------|
| Frontend | `FrontEnd/` | Web UI to create URLs and view metrics              |
| Backend  | `BackEnd/`  | REST API, redirects, persistence, and cache         |

Typical flow:

1. The user enters a long URL and an expiration date in the frontend.
2. The backend generates a random **slug**, persists it in PostgreSQL, and returns the short link.
3. When visiting `http://localhost:8000/{slug}`, the backend redirects and records the click.
4. The frontend shows charts and totals by calling the metrics endpoints.

---

## Monorepo structure

```
MetricLink/
├── FrontEnd/                 # React application (SPA)
│   ├── src/
│   │   ├── components/       # UrlForm, UrlCard, Sidebar, MetricsChart
│   │   ├── pages/            # Home, Metrics
│   │   ├── services/         # HTTP client (axios) for the API
│   │   ├── types/            # Shared TypeScript types
│   │   ├── App.tsx           # Application routes
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── BackEnd/                  # Python API (FastAPI)
│   ├── src/
│   │   ├── domain/           # Entities, exceptions, and contracts (repositories)
│   │   ├── application/      # Use cases (business rules)
│   │   └── infrastructure/   # HTTP, database, cache, concrete implementations
│   ├── tests/                # Unit tests with pytest and fakes
│   ├── requirements.txt
│   └── .env.exemple          # Environment variables template
│
├── .github/workflows/        # CI pipeline (GitHub Actions)
└── README.md                 # This file
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
| **Recharts**     | Per-day click charts                               |
| **ESLint**       | TypeScript/React linting                           |

The frontend runs by default at **http://localhost:5173**.

### Backend (`BackEnd/`)

| Technology       | Usage                                              |
|------------------|----------------------------------------------------|
| **Python 3.12+** | API language                                       |
| **FastAPI**      | Web framework and auto-generated docs (OpenAPI)    |
| **Uvicorn**      | ASGI server                                        |
| **Pydantic**     | Request/response schema validation                 |
| **PostgreSQL**   | Persistence for URLs and click metrics             |
| **psycopg**      | PostgreSQL driver                                  |
| **Redis**        | Redirect cache (slug → original URL)               |
| **pytest**       | Automated tests                                    |
| **Ruff**         | Python linter                                      |

The API runs by default at **http://127.0.0.1:8000**.

---

## Architecture

### Backend — Clean Architecture (layers)

The backend follows **Clean Architecture** in layers: business rules at the center, use cases in the application layer, and technical details (HTTP, PostgreSQL, Redis) in infrastructure. It applies **Clean Code** principles: dependencies point inward, each use case has a single responsibility, and the domain does not know about FastAPI or the database.

```
┌────────────────────────────────────────────────────────────┐
│  infrastructure/http     FastAPI, routes, Pydantic schemas │
│  infrastructure/database PostgreSQL repositories           │
│  infrastructure/cache    Redis (CacheService)              │
└───────────────────────────┬────────────────────────────────┘
                            │ depends on
┌───────────────────────────▼────────────────────────────────┐
│  application/use_cases   CreateUrl, RedirectUrl,           │
│                          GetMetrics, DeleteUrl             │
└───────────────────────────┬────────────────────────────────┘
                            │ depends on
┌───────────────────────────▼────────────────────────────────┐
│  domain/                 Url (entity), UrlRepository,      │
│                          MetricRepository, exceptions      │
└────────────────────────────────────────────────────────────┘
```

**Main use cases:**

| Use case      | Responsibility                                                                 |
|---------------|--------------------------------------------------------------------------------|
| `CreateUrl`   | Generates a secure slug, caps expiration at 30 days, and saves the URL         |
| `RedirectUrl` | Reads Redis cache; if missing, queries the DB, validates expiration, caches    |
| `GetMetrics`  | Total clicks, clicks per day, and history                                      |
| `DeleteUrl`   | Removes a URL by slug                                                          |

In the domain, contracts such as `UrlRepository` enable **dependency inversion**; entities expose behavior (`Url.is_expired()`), and business errors become typed exceptions (`UrlNotFoundError`, `ExpiredUrlError`). Tests use **fakes** in `BackEnd/tests/fake/` with the same interfaces as production.

**Persistence:** the script `BackEnd/src/infrastructure/database/schema.sql` defines the `urls` and `metrics` tables.

**Cache:** on each successful redirect, the original URL is stored in Redis with a TTL until the link expires, reducing PostgreSQL queries.

### Frontend — SPA with routing

- **`/` (Home):** form to shorten URLs, sidebar with created links (stored in `localStorage`), and a card with the selected link details.
- **`/metrics/:slug` (Metrics):** metrics page with totals, per-day list, and chart (Recharts).

The backend is accessed via `FrontEnd/src/services/api.ts`, which points to `http://127.0.0.1:8000`. API CORS is configured to accept requests from `http://localhost:5173`.

---

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended) — frontend
- [Python 3.12+](https://www.python.org/) — backend
- [PostgreSQL](https://www.postgresql.org/) — database
- [Redis](https://redis.io/) — redirect cache

---

## Running the project

### 1. Clone the repository

```bash
git clone https://github.com/EnzoQuatrochi/MetricLink.git
cd MetricLink
```

### 2. Set up the database

Create a PostgreSQL database and run the schema:

```bash
psql -U your_user -d your_database -f BackEnd/src/infrastructure/database/schema.sql
```

This creates the `urls` and `metrics` tables.

### 3. Set up the backend

In the `BackEnd/` folder:

```bash
cd BackEnd
python -m venv .venv
```

**Windows (PowerShell):**

```powershell
.\.venv\Scripts\Activate.ps1
```

**Linux/macOS:**

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the `.env` file from the example (the template in the repo is named `.env.exemple`):

```bash
cp .env.exemple .env   # Linux/macOS
# or copy manually on Windows
```

Edit `.env` with your credentials:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
REDIS_URL=redis://localhost:6379/0
```

> **Note:** `REDIS_URL` is required for the redirect cache service. Make sure Redis is running.

Start the API:

```bash
uvicorn src.infrastructure.http.app:app --reload --host 127.0.0.1 --port 8000
```

Interactive API docs (Swagger): **http://127.0.0.1:8000/docs**

### 4. Set up the frontend

In another terminal, in the `FrontEnd/` folder:

```bash
cd FrontEnd
npm install
npm run dev
```

---

## REST API

| Method   | Endpoint               | Description                                        |
|----------|------------------------|----------------------------------------------------|
| `POST`   | `/urls`                | Create short URL (`original_url`, `expires_at`)    |
| `GET`    | `/{slug}`              | Redirect (302) and record click                    |
| `GET`    | `/urls/{slug}/metrics` | Metrics for a day (`day` as query param)           |
| `GET`    | `/urls/{slug}/history` | Total and per-day click history                    |
| `DELETE` | `/urls/{slug}`         | Remove URL by slug                                 |

---

## Tests

Tests cover the entire **backend**. They are **unit** tests: they exercise the domain and use cases in memory, without starting PostgreSQL, Redis, or the API.

### Structure

```
BackEnd/tests/
├── fake/
│   ├── fake_url_repository.py      # In-memory UrlRepository implementation
│   ├── fake_metric_repository.py   # In-memory MetricRepository implementation
│   └── fake_cache_service.py       # Simulated cache for RedirectUrl
├── test_create_url.py              # URL creation and 30-day limit
├── test_redirect_url.py            # Redirect, expiration, and missing slug
├── test_get_metrics.py             # Click registration and queries
├── test_url.py                     # Url entity (is_expired)
└── test_url_exceptions.py          # Domain exceptions
```

### What is tested

| File                   | Focus                                                          |
|------------------------|----------------------------------------------------------------|
| `test_create_url.py`   | Slug generated, URL persisted, expiration capped at 30 days    |
| `test_redirect_url.py` | Original URL returned, `ExpiredUrlError`, `UrlNotFoundError`   |
| `test_get_metrics.py`  | Total count, clicks per day, and date filter                   |
| `test_url.py`          | `Url.is_expired()` for valid and expired links                 |
| `test_url_exceptions.py` | Domain exception types and messages                          |

### Fakes

Instead of mocking external libraries, the project uses **fakes** — simple implementations of repository contracts:

- `FakeUrlRepository` stores URLs in a dictionary (`slug → Url`).
- `FakeMetricRepository` accumulates clicks in memory.
- `FakeCacheService` simulates get/set/delete without Redis.

This keeps tests fast, deterministic, and aligned with Clean Architecture: the use case receives the same interface it would use in production.

### How to run

With the virtual environment activated in `BackEnd/`:

```bash
# Run all tests
pytest

# More verbose output
pytest -v

# A specific file or test
pytest tests/test_redirect_url.py
pytest tests/test_create_url.py::test_create_url_valid
```

### Static analysis (backend)

```bash
ruff check .
```

---

## CI/CD

The workflow in `.github/workflows/ci.yml` runs on push/PR to the `main` and `develop` branches:

1. Code checkout
2. Python 3.12
3. Install `BackEnd/requirements.txt`
4. **Ruff** (`ruff check .`)
5. **pytest** (working directory: `BackEnd`)

---
