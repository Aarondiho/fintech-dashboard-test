# Backend Service (Python FastAPI + SQLite)

This directory contains the Python FastAPI backend service powering the Transaction Reporting Dashboard.

## Architecture & Data Source
- **FastAPI**: REST endpoints with automatic OpenAPI documentation (`/docs`).
- **SQLite Database**: `transactions.db` initialized with 650+ realistic transaction records.
- **JSON Dataset**: `transactions.json` fallback representation of the seeded transactions.
- **Pydantic Schemas**: Structured validation for records, pagination envelopes, and summary telemetry in `models.py`.
- **Database Engine**: Optimized SQL queries in `database.py` utilizing parameterized filtering, pagination, and multi-currency aggregation.

## Setup & Running

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server with Uvicorn
uvicorn main:app --reload --port 8000
```

The interactive OpenAPI Swagger documentation will be accessible at `http://localhost:8000/docs`.
