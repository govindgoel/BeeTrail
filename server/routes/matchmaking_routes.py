from fastapi import APIRouter, HTTPException
from models.models import MatchmakingRequest, MatchmakingResponse
from db import matchmaking_collection, farms_collection, farmer_collection
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

def serialize_req(req):
    req["_id"] = str(req["_id"])
    req["farm_id"] = str(req["farm_id"])

    if "farm" in req:
        farm = req["farm"]
        farm["_id"] = str(farm["_id"])
        farm["farmer_id"] = str(farm["farmer_id"])
        req["farm"] = farm

    return req


@matchmaking_router.get("/requests/farmer/{farmer_id}")
async def get_farmer_matchmaking_requests(farmer_id: str):
    # Find farmer from farmers collection
    farmer = await farmer_collection.find_one({"_id": ObjectId(farmer_id)})
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    
    # Find farms for this farmer
    farms = await farms_collection.find({"farmer_id": str(farmer["_id"])}).to_list(length=None)
    if not farms:
        raise HTTPException(status_code=404, detail="No farms found for this farmer")

    # Create a map of farm_id -> farm data for quick lookup
    farm_map = {str(farm["_id"]): farm for farm in farms}
    
    # Fetch matchmaking requests and attach farm info
    requests = []
    for farm_id, farm in farm_map.items():
        farm_requests = await matchmaking_collection.find({"farm_id": farm_id}).to_list(length=None)
        for req in farm_requests:
            req["farm"] = farm  # Attach corresponding farm data
            requests.append(req)

    if not requests:
        raise HTTPException(status_code=404, detail="No matchmaking requests found for this farmer")

    serialize_requests = [serialize_req(req) for req in requests]

    return serialize_requests


@matchmaking_router.get("/requests/beekeeper/{beekeeper_id}")
async def get_beekeeper_matchmaking_requests(beekeeper_id: str):
    requests = await matchmaking_collection.find({"beekeeper_id": beekeeper_id}).to_list(length=None)

    #populate farm details using farm_id
    for req in requests:
        farm = await farms_collection.find_one({"_id": ObjectId(req["farm_id"])})
        if farm:
            req["farm"] = farm
        else:
            req["farm"] = None
    

    if not requests:
        raise HTTPException(status_code=404, detail="No matchmaking requests found for this beekeeper")

    serialize_requests = [serialize_req(req) for req in requests]

    return serialize_requests