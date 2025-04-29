from pydantic import BaseModel, Field
from typing import List
from datetime import timedelta, datetime

class Price(BaseModel):
    currency: str
    value: str

class BreakupItem(BaseModel):
    title: str
    price: Price

class QuoteRequest(BaseModel):
    price: Price
    breakup: List[BreakupItem]
    ttl: str  # Time to live (e.g., "P1D" for 1 day)

class QuoteResponse(QuoteRequest):
    created_at: datetime
