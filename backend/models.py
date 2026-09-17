from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Transaction(BaseModel):
    id: str
    date: str
    amount: int = Field(..., description="Integer in lowest currency subunit (e.g. cents or BIF)")
    currency: str = Field(..., description="Currency code (e.g. 'BIF', 'USD')")
    status: str = Field(..., description="'COMPLETED', 'PENDING', or 'FAILED'")
    channel: str = Field(..., description="'MOBILE_MONEY', 'CARD', or 'BANK_TRANSFER'")
    counterparty: str = Field(..., description="Counterparty name and phone/contact info")

class PaginationMetadata(BaseModel):
    page: int
    limit: int
    total_records: int
    total_pages: int
    has_next: bool
    has_prev: bool

class PaginatedTransactionsResponse(BaseModel):
    data: List[Transaction]
    pagination: PaginationMetadata

class CurrencyVolume(BaseModel):
    currency: str
    total_amount: int
    formatted: str

class StatusMetric(BaseModel):
    count: int
    volume_by_currency: Dict[str, int]
    formatted: Dict[str, str]

class TrendPoint(BaseModel):
    label: str
    date: str
    full_date: str
    volume_usd: int
    volume_bif: int
    amount: int
    txs: int
    completed_txs: int

class TransactionSummaryResponse(BaseModel):
    total_volume: int = Field(..., description="Total transaction volume (sum of amounts)")
    total_count: int = Field(..., description="Total transaction count")
    completed_count: int = Field(..., description="COMPLETED transaction count")
    successful_count: Optional[int] = None
    pending_count: int
    failed_count: int
    success_rate_percentage: float = Field(..., description="Success rate percentage (COMPLETED count / total count)")
    total_volume_by_currency: Dict[str, int]
    formatted_volumes: Dict[str, str]
    status_breakdown: Optional[Dict[str, Any]] = None
    # Primary normalized or representative volume
    total_volume_usd_cents: int
    total_volume_bif: int
    time_range: Optional[str] = None
    trend_points: Optional[List[TrendPoint]] = None
