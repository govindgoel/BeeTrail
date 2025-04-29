from fastapi import APIRouter, HTTPException
from typing import List
from models.rating_models import RatingRequest, RatingResponse
from db import rating_collection
from datetime import datetime
from bson import ObjectId

rating_router = APIRouter()

@rating_router.post("/", response_model=RatingResponse)
async def create_rating(data: RatingRequest):
    # Create the rating document
    rating_doc = data.dict()
    rating_doc["timestamp"] = datetime.utcnow()
    rating_doc["id"] = f"rating_{str(ObjectId())}"

    result = await rating_collection.insert_one(rating_doc)
    rating_id = rating_doc["id"]

    return RatingResponse(id=rating_id, **rating_doc)

@rating_router.get("/{rating_id}", response_model=RatingResponse)
async def get_rating(rating_id: str):
    rating = await rating_collection.find_one({"id": rating_id})

    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")

    return RatingResponse(
        id=rating["id"],
        rating_category=rating["rating_category"],
        value=rating["value"],
        feedback=rating["feedback"],
        rated_by=rating["rated_by"],
        rated_for=rating["rated_for"],
        timestamp=rating["timestamp"]
    )

@rating_router.get("/ratings/{rated_for}", response_model=List[RatingResponse])
async def get_ratings_for_beekeeper(rated_for: str):
    ratings = await rating_collection.find({"rated_for": rated_for}).to_list(length=None)

    if not ratings:
        raise HTTPException(status_code=404, detail="No ratings found for this beekeeper")

    return [
        RatingResponse(
            id=str(rating["_id"]),
            rating_category=rating["rating_category"],
            value=rating["value"],
            feedback=rating["feedback"],
            rated_by=rating["rated_by"],
            rated_for=rating["rated_for"],
            timestamp=rating["timestamp"]
        )
        for rating in ratings
    ]
