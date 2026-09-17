# Transaction Reporting Dashboard

A responsive, single-page transaction reporting dashboard for viewing, filtering, searching, and auditing financial transactions.

Built with:

* **Backend:** Python, FastAPI, SQLite
* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4
* **Data:** 650+ seeded transaction records

## Features

* Server-side pagination, searching, and filtering
* Dynamic total volume, completion rate, and transaction count
* Status, channel, and currency filters
* 400ms debounced search
* URL-synchronized filters
* Responsive transaction table and detail view
* Loading, error, and retry states
* 7-day, 30-day, and all-time transaction volume charts

## 📁 Project Structure

```text
fintech-dashboard-test/
├── backend/
│   ├── main.py               # FastAPI application with CORS and OpenAPI docs
│   ├── models.py             # Pydantic schema models for transactions and summaries
│   ├── database.py           # SQLite database engine with indexed filtering & aggregation
│   ├── seed.py               # Script to generate 650+ realistic fintech records
│   ├── requirements.txt      # Python dependencies (FastAPI, Uvicorn, Pydantic)
│   ├── transactions.db       # Seeded SQLite database
│   └── README.md             # Dedicated backend setup & API documentation
├── frontend/
│   ├── src/                  # React 19 + TypeScript source code
│   │   ├── components/       # FilterBar, SummaryCards, TransactionTable, etc.
│   │   ├── utils/            # formatters and helpers
│   │   ├── types.ts          # Shared TypeScript interfaces
│   │   ├── App.tsx           # Main application state and URL synchronization
│   │   └── main.tsx          # React application entry point
│   │   └── index.css         # Tailwind CSS v4 setup, theme tokens & styling
│   ├── index.html            # HTML entry point with metadata
│   ├── package.json          # Frontend npm scripts and dependencies
│   ├── tsconfig.json         # TypeScript configuration
│   ├── vite.config.ts        # Vite build tool configuration
│   └── README.md             # Dedicated frontend documentation
├── README.md                 # Complete system documentation
└── .gitignore                # Git ignore rules
```

## 🛠️ Prerequisites

- **Python**: Version 3.10 or higher (`python3 --version`)
- **Node.js**: Version 18.0.0 or higher (`node -v`)
- **npm**: Version 9.0.0 or higher (`npm -v`)

---

## 🚀 Setup and Run

### 1. Backend

From the project root:

```bash
cd backend
```

Create a virtual environment:

```bash
# macOS / Linux / Ubuntu
python3 -m venv .venv

# Windows
py -3 -m venv .venv
```

Activate it:

```bash
# macOS / Linux / Ubuntu
source .venv/bin/activate

# Windows
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API: http://localhost:8000
Swagger documentation: http://localhost:8000/docs

### 2. Frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Dashboard: http://localhost:5173

The Vite development server proxies `/api` requests to the FastAPI backend at `http://localhost:8000`.

### Re-seeding Data (Optional)

To regenerate 650+ fresh randomized transaction records in both SQLite and JSON:
```bash
# macOS / Linux / Ubuntu
python3 backend/seed.py

# Windows
py backend/seed.py

```

---

## 📡 API Endpoints Specification

### 1. `GET /api/transactions`
Returns a paginated list of financial transactions matching the query filters.

**Query Parameters:**
| Parameter | Type | Default | Description |
|---|---|---|---|
| `page` | Integer | `1` | Page number (1-indexed) |
| `limit` | Integer | `10` | Records per page (1 to 100) |
| `status` | String | `ALL` | `COMPLETED`, `PENDING`, `FAILED` |
| `channel` | String | `ALL` | `MOBILE_MONEY`, `CARD`, `BANK_TRANSFER` |
| `currency`| String | `ALL` | `USD`, `BIF` |
| `search` | String | `""` | Substring match against `counterparty` or `id` |

**Sample Response:**
```json
{
  "data": [
    {
      "id": "tx_d6b3ad9e7f32",
      "date": "2026-03-16T08:22:20Z",
      "amount": 154652,
      "currency": "USD",
      "status": "COMPLETED",
      "channel": "MOBILE_MONEY",
      "counterparty": "David O'Connor (+353 1 496 0122)"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_records": 650,
    "total_pages": 65,
    "has_next": true,
    "has_prev": false
  }
}
```

---

### 2. `GET /api/transactions/summary`
Returns aggregated statistics computed dynamically across the current filter scope.

**Sample Response:**
```json
{
  "total_count": 650,
  "completed_count": 470,
  "pending_count": 123,
  "failed_count": 57,
  "success_rate_percentage": 72.31,
  "total_volume_by_currency": {
    "USD": 180211305,
    "BIF": 3218641489
  },
  "formatted_volumes": {
    "USD": "$1,802,113.05",
    "BIF": "3,218,641,489 BIF"
  },
  "total_volume_usd_cents": 180211305,
  "total_volume_bif": 3218641489
}
```

---

## 📐 Architectural Decisions & Tradeoffs

1. *React + Vite + FastAPI:*
   React + Vite was chosen for the single-page, highly interactive dashboard and strict 48-hour deadline, providing fast development and direct integration with the FastAPI backend. The frontend and backend are separated and communicate through REST APIs, making the application easier to maintain and extend.

2. *SQLite:*
   Chosen for its zero-configuration setup and suitability for the assessment's seeded dataset. For a production system with high concurrency, a server-grade database such as PostgreSQL would be more appropriate.

3. *Server-Side Processing:*
   Filtering, searching, pagination, and summary calculations are handled by the backend to reduce data transfer and support larger datasets efficiently.

4. *Integer-Based Monetary Values:*
   Amounts are stored in the lowest currency subunit to avoid floating-point rounding issues in financial calculations.

5. *Debounced Search & URL State:*
   Search is debounced by 400ms to reduce unnecessary requests, while filters are synchronized with URL parameters to preserve and share dashboard views.

6. *Utility-First Styling with Tailwind CSS:*
   Chosen for consistent styling and responsive design, with built-in `dark:` variants for light/dark mode and responsive layouts.
