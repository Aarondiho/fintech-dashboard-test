import os
import sqlite3
from typing import Dict, Any, List, Optional, Tuple

DB_PATH = os.path.join(os.path.dirname(__file__), "transactions.db")

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def build_filter_clause(
    status: Optional[str] = None,
    channel: Optional[str] = None,
    search: Optional[str] = None,
    currency: Optional[str] = None,
) -> Tuple[str, List[Any]]:
    clauses = []
    params: List[Any] = []

    if status and status.upper() != "ALL":
        stat = status.upper()
        if stat in ("SUCCESSFUL", "COMPLETED"):
            clauses.append("status IN ('SUCCESSFUL', 'COMPLETED')")
        else:
            clauses.append("status = ?")
            params.append(stat)

    if channel and channel.upper() != "ALL":
        clauses.append("channel = ?")
        params.append(channel.upper())

    if currency and currency.upper() != "ALL":
        clauses.append("currency = ?")
        params.append(currency.upper())

    if search and search.strip():
        search_term = f"%{search.strip()}%"
        clauses.append("(counterparty LIKE ? OR id LIKE ?)")
        params.extend([search_term, search_term])

    where_sql = ("WHERE " + " AND ".join(clauses)) if clauses else ""
    return where_sql, params

def query_paginated_transactions(
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    channel: Optional[str] = None,
    search: Optional[str] = None,
    currency: Optional[str] = None,
) -> Dict[str, Any]:
    page = max(1, page)
    limit = max(1, min(limit, 100))
    offset = (page - 1) * limit

    where_sql, params = build_filter_clause(status, channel, search, currency)

    conn = get_db_connection()
    cursor = conn.cursor()

    # Get total count matching filter
    count_query = f"SELECT COUNT(*) as cnt FROM transactions {where_sql}"
    cursor.execute(count_query, params)
    total_records = cursor.fetchone()["cnt"]

    total_pages = max(1, (total_records + limit - 1) // limit) if total_records > 0 else 1

    # Fetch paginated rows
    data_query = f"""
        SELECT id, date, amount, currency, status, channel, counterparty
        FROM transactions
        {where_sql}
        ORDER BY date DESC
        LIMIT ? OFFSET ?
    """
    cursor.execute(data_query, params + [limit, offset])
    rows = cursor.fetchall()
    conn.close()

    data = [
        {
            "id": row["id"],
            "date": row["date"],
            "amount": row["amount"],
            "currency": row["currency"],
            "status": row["status"],
            "channel": row["channel"],
            "counterparty": row["counterparty"],
        }
        for row in rows
    ]

    return {
        "data": data,
        "pagination": {
            "page": page,
            "limit": limit,
            "total_records": total_records,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1,
        },
    }

def query_transaction_summary(
    status: Optional[str] = None,
    channel: Optional[str] = None,
    search: Optional[str] = None,
    currency: Optional[str] = None,
) -> Dict[str, Any]:
    where_sql, params = build_filter_clause(status, channel, search, currency)

    conn = get_db_connection()
    cursor = conn.cursor()

    # Aggregate counts by status
    status_query = f"""
        SELECT 
            COUNT(*) as total_count,
            SUM(CASE WHEN status IN ('SUCCESSFUL', 'COMPLETED') THEN 1 ELSE 0 END) as successful_count,
            SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending_count,
            SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed_count
        FROM transactions
        {where_sql}
    """
    cursor.execute(status_query, params)
    counts = cursor.fetchone()
    total_count = counts["total_count"] or 0
    successful_count = counts["successful_count"] or 0
    pending_count = counts["pending_count"] or 0
    failed_count = counts["failed_count"] or 0

    success_rate = (successful_count / total_count * 100.0) if total_count > 0 else 0.0

    # Aggregate volume by status and currency
    breakdown_query = f"""
        SELECT 
            CASE WHEN status IN ('SUCCESSFUL', 'COMPLETED') THEN 'SUCCESSFUL' ELSE status END as norm_status,
            currency,
            COUNT(*) as tx_count,
            SUM(amount) as subtotal
        FROM transactions
        {where_sql}
        GROUP BY norm_status, currency
    """
    cursor.execute(breakdown_query, params)
    bd_rows = cursor.fetchall()

    status_breakdown = {
        "SUCCESSFUL": {"count": 0, "volume_by_currency": {"USD": 0, "BIF": 0}, "formatted": {"USD": "$0.00", "BIF": "0 BIF"}},
        "PENDING": {"count": 0, "volume_by_currency": {"USD": 0, "BIF": 0}, "formatted": {"USD": "$0.00", "BIF": "0 BIF"}},
        "FAILED": {"count": 0, "volume_by_currency": {"USD": 0, "BIF": 0}, "formatted": {"USD": "$0.00", "BIF": "0 BIF"}},
    }

    for row in bd_rows:
        st = row["norm_status"]
        cur = row["currency"]
        cnt = row["tx_count"] or 0
        subtotal = row["subtotal"] or 0
        if st in status_breakdown:
            status_breakdown[st]["count"] += cnt
            status_breakdown[st]["volume_by_currency"][cur] = subtotal

    for st, data in status_breakdown.items():
        usd = data["volume_by_currency"].get("USD", 0)
        bif = data["volume_by_currency"].get("BIF", 0)
        data["formatted"]["USD"] = f"${usd / 100:,.2f}"
        data["formatted"]["BIF"] = f"{bif:,.0f} BIF"

    # Aggregate volume by currency
    volume_query = f"""
        SELECT currency, SUM(amount) as total_volume
        FROM transactions
        {where_sql}
        GROUP BY currency
    """
    cursor.execute(volume_query, params)
    vol_rows = cursor.fetchall()
    conn.close()

    total_volume_by_currency = {"USD": 0, "BIF": 0}
    for row in vol_rows:
        cur = row["currency"]
        total_volume_by_currency[cur] = row["total_volume"] or 0

    # Format volumes
    usd_cents = total_volume_by_currency.get("USD", 0)
    bif_amount = total_volume_by_currency.get("BIF", 0)

    formatted_usd = f"${usd_cents / 100:,.2f}"
    formatted_bif = f"{bif_amount:,.0f} BIF"

    return {
        "total_volume": usd_cents + bif_amount,
        "total_count": total_count,
        "completed_count": successful_count,
        "successful_count": successful_count,
        "pending_count": pending_count,
        "failed_count": failed_count,
        "success_rate_percentage": round(success_rate, 2),
        "total_volume_by_currency": total_volume_by_currency,
        "formatted_volumes": {
            "USD": formatted_usd,
            "BIF": formatted_bif,
        },
        "status_breakdown": status_breakdown,
        "total_volume_usd_cents": usd_cents,
        "total_volume_bif": bif_amount,
    }
