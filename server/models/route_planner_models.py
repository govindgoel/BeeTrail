from pydantic import BaseModel
from typing import List, Dict

class BloomingSite(BaseModel):
    id: str
    crop: str
    gps: str  # Format: "latitude,longitude"
    flowering_stage: str
    estimated_bloom_time: str  # DateTime or range
    weather_conditions: Dict  # A dictionary with weather info (e.g., temperature, humidity)

class RoutePlanRequest(BaseModel):
    current_location: str  # Current GPS coordinates of the beekeeper
    blooming_sites: List[BloomingSite]  # List of sites to travel to
    beekeeper_preferences: Dict  # Preferences (e.g., shortest route, best weather)

class RoutePlanResponse(BaseModel):
    optimal_route: List[str]  # List of GPS coordinates (or site IDs) in the optimal route
    total_travel_time: float  # Total time for the entire journey
    estimated_cost: float  # Estimated cost based on distance and other factors
