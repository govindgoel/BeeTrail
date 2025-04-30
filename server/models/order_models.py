from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timedelta, date

class Price(BaseModel):
    currency: str
    value: str

class BreakupItem(BaseModel):
    title: str
    price: Price

class OrderRequest(BaseModel):
    matchmaking_id: str
    is_accepted: bool = False
    breakup: Optional[List[BreakupItem]] = None
    price: Price
    ttl: Optional[datetime] = None 
    payment_method: str = "online"  # Default to "online", can be "cash" or "online"
    payment_status: str = "pending"  # Default to "pending", can be "paid" or "pending"
    order_state: str = "pending"  # Default to "pending", can be "accepted" or "rejected"
    payment_link: Optional[str] = None  # Only required for online payments
    contract_pdf_url: Optional[str] = None  # Path to contract PDF

class OrderResponse(OrderRequest):
    id: str
    created_at: datetime
    payment_link: Optional[str] = None  # Only required for online payments
    contract_pdf_url: Optional[str] = None  # Path to contract PDF