from fastapi import APIRouter, HTTPException
from typing import List
from models.fulfillment_models import FulfillmentRequest, FulfillmentResponse
from db import fulfillment_collection
from datetime import datetime

fulfillment_router = APIRouter()

@fulfillment_router.post("/request", response_model=FulfillmentResponse)
async def create_fulfillment_request(data: FulfillmentRequest):
    request_doc = data.dict(by_alias=True)
    request_doc["created_at"] = datetime.utcnow()

    result = await fulfillment_collection.insert_one(request_doc)
    request_id = str(result.inserted_id)

    return FulfillmentResponse(id=data.id, **request_doc)

@fulfillment_router.get("/requests/{fulfillment_id}", response_model=FulfillmentResponse)
async def get_fulfillment_request(fulfillment_id: str):
    fulfillment = await fulfillment_collection.find_one({"id": fulfillment_id})

    if not fulfillment:
        raise HTTPException(status_code=404, detail="Fulfillment request not found")

    return FulfillmentResponse(
        id=fulfillment["id"],
        type=fulfillment["type"],
        start=fulfillment["start"],
        end=fulfillment["end"],
        created_at=fulfillment["created_at"]
    )
