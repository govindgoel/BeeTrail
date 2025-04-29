from fastapi import APIRouter, HTTPException
from models.models import MatchmakingRequest, MatchmakingResponse
from db import matchmaking_collection
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

@matchmaking_router.get("/requests/{farmer_id}", response_model=List[MatchmakingResponse])
async def get_farmer_matchmaking_requests(farmer_id: str):
    requests = await matchmaking_collection.find({"farmer_id": farmer_id}).to_list(length=None)

    if not requests:
        raise HTTPException(status_code=404, detail="No matchmaking requests found for this farmer")

    return [
        MatchmakingResponse(
            id=str(req["_id"]),
            farmer_id=req["farmer_id"],
            crops=req["crops"],
            required_species=req.get("required_species", []),
            land_area_acres=req["land_area_acres"],
            gps=req["gps"],
            pollination_window_start=req["pollination_window_start"],
            pollination_window_end=req["pollination_window_end"],
            created_at=req["created_at"]
        )
        for req in requests
    ]
