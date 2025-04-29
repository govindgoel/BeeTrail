from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Price(BaseModel):
    value: str

class Payment(BaseModel):
    status: str
    collected_by: str

class Quote(BaseModel):
    price: Price

class Item(BaseModel):
    id: str  # Service ID

class Provider(BaseModel):
    id: str  # Beekeeper ID

class Fulfillment(BaseModel):
    id: str  # Fulfillment ID

class OrderRequest(BaseModel):
    provider: Provider
    items: List[Item]
    fulfillment: Fulfillment
    quote: Quote
    payment: Payment
    state: str

class OrderResponse(OrderRequest):
    id: str
    created_at: datetime
