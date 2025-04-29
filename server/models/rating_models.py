from pydantic import BaseModel
from datetime import datetime

class Rating(BaseModel):
    rating_category: str
    value: int
    feedback: str
    rated_by: str  # User ID of the farmer giving feedback
    rated_for: str  # User ID of the beekeeper receiving feedback
    timestamp: datetime

class RatingRequest(BaseModel):
    rating_category: str
    value: int
    feedback: str
    rated_by: str
    rated_for: str

class RatingResponse(RatingRequest):
    id: str
    timestamp: datetime
