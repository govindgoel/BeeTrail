from fastapi import APIRouter, HTTPException
from models.farmer_models import FarmCreate, FarmerAccountCreate
from db import farmer_collection, farms_collection
from datetime import datetime
from bson import ObjectId
import os
import base64
import uuid

farmer_router = APIRouter()

##### FARMER ROUTES ######

# @farmer_router.post("/register-farmer")
# async def register_farmer_account(data: FarmerAccountCreate):
#     farmer_doc = {
#         "full_name": data.full_name,
#         "gender": data.gender,
#         "location": data.location,
#         "created_at": datetime.utcnow()
#     }

#     result = await farmer_collection.insert_one(farmer_doc)
#     farmer_id = str(result.inserted_id)

#     return {
#         "id": f"{farmer_id}",
#         "full_name": data.full_name,
#         "gender": data.gender,
#         "gps": data.gps
#     }

def store_photo(photo_base64: str, farmer_id: str):
    directory = f"photos/{farmer_id}/"
    os.makedirs(directory, exist_ok=True)

    try:
        photo_data = base64.b64decode(photo_base64)
        filename = f"{uuid.uuid4()}.jpg"
        file_path = os.path.join(directory, filename)

        with open(file_path, "wb") as f:
            f.write(photo_data)

        print(f"Photo saved successfully at {file_path}")

    except base64.binascii.Error as e:
        print(f"Error decoding base64 photo: {e}")
    except Exception as e:
        print(f"Error saving photo: {e}")

@farmer_router.post("/register-farm")
async def register_farmer(data: FarmCreate):
    farm_doc = {
        "farmer_id": data.farmer_id,
        "name": data.name,
        "location": data.location,
        "fulladdress": data.fulladdress,
        "total_beebox": data.total_beebox,
        "bee_box_capacity_utilised": 0,
        "farm_size": data.farm_size,
        "blooming_crops": data.blooming_crops,
        "blooming_start_date": data.blooming_start_date,
        "farming_method": data.farming_method,
        "farm_photos": data.farm_photos,
        "preferredLanguage": data.preferredLanguage,
    }
    
    #sync name and location to farmer collection
    await farmer_collection.update_one(
        {"_id": ObjectId(data.farmer_id)},
        {
            "$set": {
                "name": data.name,
                "location": data.location,
                "updated_at": datetime.utcnow()
            }
        }
    )

    result = await farms_collection.insert_one(farm_doc)
    farm_id = str(result.inserted_id)

    for photo in data.farm_photos:
        store_photo(photo, farm_id)

    return {
        "id": farm_id,
        "message": "Farm registered successfully"
    }

@farmer_router.get("/farm/{farm_id}")
async def get_farm(farm_id: str):
    if not ObjectId.is_valid(farm_id):
        raise HTTPException(status_code=400, detail="Invalid farm ID")

    farm_data = await farms_collection.find_one({"_id": ObjectId(farm_id)})

    if not farm_data:
        raise HTTPException(status_code=404, detail="Farm not found")

    farm_data["_id"] = str(farm_data["_id"])  # convert ObjectId to string
    return {
        "farm": farm_data
    }

def serialize_farm(farm: dict) -> dict:
    farm["_id"] = str(farm["_id"])
    if "beekeeper_id" in farm and isinstance(farm["beekeeper_id"], ObjectId):
        farm["beekeeper_id"] = str(farm["beekeeper_id"])
    return farm

@farmer_router.get("/farms/{beekeeper_id}")
async def get_farms(beekeeper_id: str):
    if not ObjectId.is_valid(beekeeper_id):
        raise HTTPException(status_code=400, detail="Invalid beekeeper ID")

    farms = await farms_collection.find().to_list(length=None)

    if not farms:
        raise HTTPException(status_code=404, detail="No farms found for this beekeeper")

    serialized_farms = [serialize_farm(farm) for farm in farms]

    return {"farms": serialized_farms}

@farmer_router.get("/farms/{farmer_id}")
async def get_farmer_farms(farmer_id: str):
    if not ObjectId.is_valid(farmer_id):
        raise HTTPException(status_code=400, detail="Invalid farmer ID")

    farms = await farms_collection.find({"farmer_id": farmer_id}).to_list(length=None)

    if not farms:
        raise HTTPException(status_code=404, detail="No farms found for this farmer")

    serialized_farms = [serialize_farm(farm) for farm in farms]

    return {"farms": serialized_farms}