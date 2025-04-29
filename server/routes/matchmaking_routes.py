from fastapi import APIRouter, HTTPException
from models.models import MatchmakingRequest, MatchmakingResponse
from db import matchmaking_collection, farms_collection
from datetime import datetime
from typing import List
from bson import ObjectId

matchmaking_router = APIRouter()

@matchmaking_router.post("/request", response_model=MatchmakingResponse)
async def create_matchmaking_request(data: MatchmakingRequest):
    request_doc = data.dict()
    request_doc["created_at"] = datetime.utcnow()

    result = await matchmaking_collection.insert_one(request_doc)
    request_id = str(result.inserted_id)

    return MatchmakingResponse(id=request_id, **request_doc)

def serialize_req(request: dict) -> dict:
    request["_id"] = str(request["_id"])
    if "farmer_id" in request and isinstance(request["farmer_id"], ObjectId):
        request["farmer_id"] = str(request["farmer_id"])
    return request


@matchmaking_router.get("/requests/farmer/{farmer_id}", response_model=List[MatchmakingResponse])
async def get_farmer_matchmaking_requests(farmer_id: str):
    requests = await matchmaking_collection.find({"farmer_id": farmer_id}).to_list(length=None)
    #in each requests find the farm details from farm_id
    for req in requests:
        farm = await farms_collection.find_one({"_id": ObjectId(req["farm_id"])})
        if farm:
            req["farm_details"] = farm
        else:
            req["farm_details"] = None

    if not requests:
        raise HTTPException(status_code=404, detail="No matchmaking requests found for this farmer")

    serialize_requests = [serialize_req(req) for req in requests]

    return serialize_requests


@matchmaking_router.get("/requests/beekeeper/{beekeeper_id}")
async def get_beekeeper_matchmaking_requests(beekeeper_id: str):
    requests = await matchmaking_collection.find({"beekeeper_id": beekeeper_id}).to_list(length=None)

    if not requests:
        raise HTTPException(status_code=404, detail="No matchmaking requests found for this beekeeper")

    serialize_requests = [serialize_req(req) for req in requests]

    return serialize_requests