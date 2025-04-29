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

class Location(BaseModel):
    id: str
    gps: str
    address: Address

class Descriptor(BaseModel):
    name: str

class BeekeeperCreate(BaseModel):
    name: str
    gps: str
    address: Address
    species: List[str]
    certifications: List[str] = []

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

class FarmerCreate(BaseModel):
    name: str
    gps: str
    address: FarmerAddress
    crops: List[str] = []
    land_area_acres: Optional[float] = 0.0

class BecknFarmerResponse(BaseModel):
    id: str
    descriptor: dict
    locations: List[dict]
    tags: dict

#MatchmakingRequest Models
class MatchmakingRequest(BaseModel):
    farmer_id: str
    required_species: Optional[List[str]] = []
    pollination_window_start: datetime
    pollination_window_end: datetime
    crops: List[str]
    land_area_acres: float
    gps: str

class MatchmakingResponse(BaseModel):
    id: str
    farmer_id: str
    crops: List[str]
    required_species: List[str]
    land_area_acres: float
    gps: str
    pollination_window_start: datetime
    pollination_window_end: datetime
    created_at: datetime
