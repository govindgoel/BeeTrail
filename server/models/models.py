# models.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# Beekeeper Models
class Address(BaseModel):
    locality: str
    city: str
    state: str
    country: str
    area_code: str


class Descriptor(BaseModel):
    name: str

class Location(BaseModel):
    latitude: float = Field(..., description="Latitude of the location")
    longitude: float = Field(..., description="Longitude of the location")

class BeekeeperCreate(BaseModel):
    beekeeper_id: str
    name: str
    userRole: str = Field(default="beekeeper")
    fulladdress: str
    location: Location
    state: str
    district: str
    numberOfHivesWithBroodOnly: int
    numberOfHivesWithBroodAndSuper: int
    frameCountPerChamber: int
    typeOfBees: str
    preferredLanguage: str

class BecknProviderResponse(BaseModel):
    id: str
    descriptor: Descriptor
    locations: List[Location]
    tags: dict

#Farmer Models
class FarmerAddress(BaseModel):
    locality: str
    city: str
    state: str
    country: str
    area_code: str

class BecknFarmerResponse(BaseModel):
    id: str
    descriptor: dict
    locations: List[dict]
    tags: dict

#MatchmakingRequest Models
class MatchmakingRequest(BaseModel):
    farm_id: str
    beekeeper_id: str
    pollination_window_start: datetime
    bee_box_count: int
    is_active : bool = True

class MatchmakingResponse(BaseModel):
    id: str
    farm_id: str
    beekeeper_id: str
    pollination_window_start: datetime
    created_at: datetime