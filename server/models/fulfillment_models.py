from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FulfillmentLocationAddress(BaseModel):
    city: str
    area_code: str

class FulfillmentLocation(BaseModel):
    gps: str
    address: FulfillmentLocationAddress

class FulfillmentTime(BaseModel):
    timestamp: datetime

class FulfillmentStart(BaseModel):
    time: FulfillmentTime
    location: FulfillmentLocation

class FulfillmentEnd(BaseModel):
    time: FulfillmentTime

class FulfillmentRequest(BaseModel):
    id: str = Field(..., alias="fulfillment_id")
    type: str = "Service"
    start: FulfillmentStart
    end: FulfillmentEnd

class FulfillmentResponse(FulfillmentRequest):
    created_at: datetime
