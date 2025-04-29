from fastapi import FastAPI, HTTPException, APIRouter
from models.models import BeekeeperCreate, BecknProviderResponse, Descriptor, Location, Address, BecknFarmerResponse
from db import beekeeper_collection, farmer_collection
from bson import ObjectId

beekeeper_router = APIRouter()

##### BEEKEEPER ROUTES ######

@beekeeper_router.post("/register")
async def register_beekeeper(data: BeekeeperCreate):
    beekeeper_doc = {
        "beekeeper_id": data.beekeeper_id,
        "name": data.name,
        "userRole": data.userRole,
        "fulladdress": data.fulladdress,
        "location": data.location.dict(),
        "state": data.state,
        "district": data.district,
        "numberOfHivesWithBroodOnly": data.numberOfHivesWithBroodOnly,
        "numberOfHivesWithBroodAndSuper": data.numberOfHivesWithBroodAndSuper,
        "frameCountPerChamber": data.frameCountPerChamber,
        "typeOfBees": data.typeOfBees,
        "preferredLanguage": data.preferredLanguage,
    }


    try:
        await beekeeper_collection.update_one(
            {"_id": ObjectId(data.beekeeper_id)},
            {"$set": beekeeper_doc},
            upsert=True
        )

        updated_doc = await beekeeper_collection.find_one(
            {"beekeeper_id": data.beekeeper_id},
            {"_id": 0}  # Exclude Mongo's internal _id if you don't want it
        )

        if not updated_doc:
            raise HTTPException(status_code=500, detail="Beekeeper registration failed.")

        return updated_doc

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@beekeeper_router.get("/{beekeeper_id}")
async def get_beekeeper(beekeeper_id: str):
    if not ObjectId.is_valid(beekeeper_id):
        raise HTTPException(status_code=400, detail="Invalid beekeeper ID")

    beekeeper = await beekeeper_collection.find_one({"_id": ObjectId(beekeeper_id)})

    if not beekeeper:
        raise HTTPException(status_code=404, detail="Beekeeper not found")

    # Convert ObjectId to string for JSON serialization
    beekeeper["_id"] = str(beekeeper["_id"])
    return beekeeper