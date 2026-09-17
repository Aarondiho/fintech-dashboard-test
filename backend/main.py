from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(__file__))
from database import query_paginated_transactions, query_transaction_summary
from models import PaginatedTransactionsResponse, TransactionSummaryResponse

app = FastAPI(
    title="Fintech Transaction Reporting Engine",
    description="High-throughput transaction auditing and reporting backend service.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "fintech-transaction-reporting", "database": "sqlite3"}

@app.get("/api/transactions", response_model=PaginatedTransactionsResponse)
def get_transactions(
    page: int = Query(1, ge=1, description="Page number starting at 1"),
    limit: int = Query(10, ge=1, le=100, description="Number of items per page"),
    status: Optional[str] = Query(None, description="Filter by status: COMPLETED, PENDING, FAILED"),
    channel: Optional[str] = Query(None, description="Filter by channel: MOBILE_MONEY, CARD, BANK_TRANSFER"),
    search: Optional[str] = Query(None, description="Substring search on counterparty or transaction ID"),
    currency: Optional[str] = Query(None, description="Filter by currency: USD, BIF"),
):
    """
    Fetch paginated transactions matching status, channel, currency, or search substring.
    """
    result = query_paginated_transactions(
        page=page,
        limit=limit,
        status=status,
        channel=channel,
        search=search,
        currency=currency,
    )
    return result

@app.get("/api/transactions/summary", response_model=TransactionSummaryResponse)
def get_transaction_summary(
    status: Optional[str] = Query(None, description="Filter by status: COMPLETED, PENDING, FAILED"),
    channel: Optional[str] = Query(None, description="Filter by channel: MOBILE_MONEY, CARD, BANK_TRANSFER"),
    search: Optional[str] = Query(None, description="Substring search on counterparty or transaction ID"),
    currency: Optional[str] = Query(None, description="Filter by currency: USD, BIF"),
):
    """
    Return aggregated statistics for the current filter criteria:
    - Total transaction volume (sum of amounts per currency)
    - Success rate percentage (COMPLETED / total count * 100)
    - Total transaction count and breakdown
    """
    result = query_transaction_summary(
        status=status,
        channel=channel,
        search=search,
        currency=currency,
    )
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
