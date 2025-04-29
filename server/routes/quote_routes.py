from fastapi import APIRouter, HTTPException
from typing import List
from models.quote_models import QuoteRequest, QuoteResponse
from db import quote_collection
from datetime import datetime
from dateutil.parser import parse

quote_router = APIRouter()

@quote_router.post("/", response_model=QuoteResponse)
async def create_quote(data: QuoteRequest):
    # Parse ttl to datetime and add it to the quote data
    ttl = parse(data.ttl) - datetime.utcnow()
    request_doc = data.dict()
    request_doc["created_at"] = datetime.utcnow()
    request_doc["ttl"] = ttl

    result = await quote_collection.insert_one(request_doc)
    quote_id = str(result.inserted_id)

    return QuoteResponse(id=quote_id, **request_doc)

@quote_router.get("/{quote_id}", response_model=QuoteResponse)
async def get_quote(quote_id: str):
    quote = await quote_collection.find_one({"id": quote_id})

    if not quote:
        raise HTTPException(status_code=404, detail="Quote not found")

    return QuoteResponse(
        id=quote["id"],
        price=quote["price"],
        breakup=quote["breakup"],
        ttl=quote["ttl"],
        created_at=quote["created_at"]
    )
