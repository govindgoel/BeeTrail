from pydantic import BaseModel, Field
from typing import List, Optional

class FarmerAccountCreate(BaseModel):
    full_name: str
    gender: str  # You can later restrict this to enum if needed
    gps: str
    created_at: Optional[str] = None  # Optional field for created_at timestamp
    updated_at: Optional[str] = None  # Optional field for updated_at timestamp

class FarmerAccountResponse(BaseModel):
    id: str
    full_name: str
    gender: str
    gps: str


class FarmAddress(BaseModel):
    city: str
    area_code: str
    state: str
    country: str
    street: str

class CropLocation(BaseModel):
    gps: str
    flowering_stage: Optional[str] = None  # Optional flowering stage
    address: Optional[FarmAddress] = None  # Optional address for the location

class Location(BaseModel):
    latitude: float = Field(..., description="Latitude of the location")
    longitude: float = Field(..., description="Longitude of the location")

class FarmCreate(BaseModel):
    farmer_id: str # ID of the farmer
    name: str
    location: Location
    fulladdress: str
    state: str
    district: str
    total_beebox: Optional[int] = 0
    blooming_crops: List[str] = []
    blooming_start_date: Optional[str] = None  # Format: YYYY-MM-DD
    farming_method: Optional[str] = None
    farm_photos: List[str] = []  
    farm_size: Optional[float] = 0.0
    bee_box_capacity_utilised: Optional[int] = 0
    organic: Optional[bool] = False
    preferredLanguage: Optional[str] = None
    created_at : Optional[str] = None  # Optional field for created_at timestamp
    updated_at : Optional[str] = None  # Optional field for updated_at timestamp

class BecknFarmResponse(BaseModel):
    # id: str
    # descriptor: dict
    # locations: List[dict]
    # tags: dict
    context: Optional[dict] = None  # Optional context field
    message: Optional[dict] = None  # Optional message field

