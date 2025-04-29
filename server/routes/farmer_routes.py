from fastapi import APIRouter, HTTPException
from models.farmer_models import FarmCreate, BecknFarmResponse, FarmerAccountResponse, FarmerAccountCreate
from db import farmer_collection, farms_collection
from datetime import datetime
from bson import ObjectId
from typing import List
import os
import base64
import uuid
from utils.beckn import beckn_response

farmer_router = APIRouter()

##### FARMER ROUTES ######

@farmer_router.post("/register-farmer", response_model=FarmerAccountResponse)
async def register_farmer_account(data: FarmerAccountCreate):
    farmer_doc = {
        "full_name": data.full_name,
        "gender": data.gender,
        "gps": data.gps,
        "created_at": datetime.utcnow()
    }

    result = await farmer_collection.insert_one(farmer_doc)
    farmer_id = str(result.inserted_id)

    return FarmerAccountResponse(
        id=f"farmer_{farmer_id}",
        full_name=data.full_name,
        gender=data.gender,
        gps=data.gps
    )

def store_photo(photo_base64: str, farmer_id: str):
    # Define the directory to store photos
    directory = f"photos/{farmer_id}/"
    os.makedirs(directory, exist_ok=True)

    try:
        # Decode the base64 string
        photo_data = base64.b64decode(photo_base64)

        # Create a unique filename for the photo
        filename = f"{uuid.uuid4()}.jpg"  # You can also detect image type if needed
        file_path = os.path.join(directory, filename)

        # Save the decoded photo to a file
        with open(file_path, "wb") as f:
            f.write(photo_data)

        print(f"Photo saved successfully at {file_path}")

    except base64.binascii.Error as e:
        print(f"Error decoding base64 photo: {e}")
    except Exception as e:
        print(f"Error saving photo: {e}")

# Register Farmer Route
@farmer_router.post("/register-farm", response_model=BecknFarmResponse)
async def register_farmer(data: FarmCreate):
    farmer_doc = {
        "farmer_id": data.farmer_id,
        "name": data.name,
        "gps": data.gps,
        "address": data.address.dict(),
        "crops": data.crops,
        "bee_box_capacity": data.bee_box_capacity,
        "bee_box_capacity_utilised": 0,
        "land_area_acres": data.land_area_acres,
        "nectar_rich": data.nectar_rich,
        "blooming_crops": data.blooming_crops,
        "blooming_start_date": data.blooming_start_date,
        "farming_method": data.farming_method,
        "farm_photos": data.farm_photos,
        "locations": [loc.dict() for loc in data.locations]  # Save locations with flowering stage
    }

    result = await farms_collection.insert_one(farmer_doc)
    farmer_id = str(result.inserted_id)

    #store photos in local storage
    for photo in data.farm_photos:
        store_photo(photo, farmer_id)


    return BecknFarmResponse(
        id=f"farmer_{farmer_id}",
        descriptor={"name": data.name},
        locations=[
            {
                "id": f"loc_{farmer_id}",
                "gps": loc.gps,
                "flowering_stage": loc.flowering_stage,  # Include flowering stage
                "address": data.address.dict()
            }
            for loc in data.locations  # Loop through the locations
        ],
        tags={
            "crops": data.crops,
            "land_area_acres": data.land_area_acres
        }
    )

# Get Farmer by ID Route
@farmer_router.get("/farm/{farm_id}", response_model=BecknFarmResponse)
async def get_farm(farm_id: str):
    if not ObjectId.is_valid(farm_id):
        raise HTTPException(status_code=400, detail="Invalid farm ID")

    farm_data = await farms_collection.find_one({"_id": ObjectId(farm_id)})

    if not farm_data:
        raise HTTPException(status_code=404, detail="Farm not found")

    farm_data_obj  = {
        "id":f"{farm_id}",
        "descriptor":{"name": farm_data["name"]},
        "locations":[
            {
                "id": f"{farm_id}",
                "gps": loc["gps"],
                # "flowering_stage": loc["flowering_stage"],  # Include flowering stage
                "address": loc["address"],
            }
            for loc in farm_data.get("locations", [])
        ],
        "tags":{
            "crops": farm_data.get("crops", []),
            "land_area_acres": farm_data.get("land_area_acres", 0.0),
            "farm_photos": farm_data.get("farm_photos", []),
            "bee_box_capacity_utilised": farm_data.get("bee_box_capacity_utilised", 0),
            "bee_box_capacity": farm_data.get("bee_box_capacity", 0),
            "blooming_start_date": farm_data.get("blooming_start_date", None),
        }
    }
    return beckn_response(
        message=farm_data_obj,
        domain="beckn.org/farmer",
        action="on_search"  # You can change this depending on actual action, e.g., "on_search" or "on_select"
    )
