# Backend Service (Python FastAPI + SQLite)

This directory contains the Python FastAPI backend service powering the Transaction Reporting Dashboard.

## Architecture & Data Source
- **FastAPI**: REST endpoints with automatic OpenAPI documentation (`/docs`).
- **SQLite Database**: `transactions.db` initialized with 650+ realistic transaction records.
- **Pydantic Schemas**: Structured validation for records, pagination envelopes, and summary telemetry in `models.py`.
- **Database Engine**: Optimized SQL queries in `database.py` utilizing parameterized filtering, pagination, and multi-currency aggregation.

## Setup & Running

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


The interactive OpenAPI Swagger documentation will be accessible at `http://localhost:8000/docs`.
