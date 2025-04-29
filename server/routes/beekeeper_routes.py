from fastapi import FastAPI, HTTPException, APIRouter
from models.models import BeekeeperCreate, BecknProviderResponse, Descriptor, Location, Address, FarmerCreate, BecknFarmerResponse
from db import beekeeper_collection, farmer_collection
from bson import ObjectId

beekeeper_router = APIRouter()

##### BEEKEEPER ROUTES ######

@beekeeper_router.post("/register", response_model=BecknProviderResponse)
async def register_beekeeper(data: BeekeeperCreate):
    beekeeper_doc = {
        "name": data.name,
        "gps": data.gps,
        "address": data.address.dict(),
        "species": data.species,
        "certifications": data.certifications,
    }

    result = await beekeeper_collection.insert_one(beekeeper_doc)
    beekeeper_id = str(result.inserted_id)

    return BecknProviderResponse(
        id=f"beekeeper_{beekeeper_id}",
        descriptor=Descriptor(name=data.name),
        locations=[
            Location(
                id=f"loc_{beekeeper_id}",
                gps=data.gps,
                address=data.address
            )
        ],
        tags={
            "species": data.species,
            "certifications": data.certifications
        }
    )

@beekeeper_router.get("/{beekeeper_id}", response_model=BecknProviderResponse)
async def get_beekeeper(beekeeper_id: str):
    if not ObjectId.is_valid(beekeeper_id):
        raise HTTPException(status_code=400, detail="Invalid beekeeper ID")

    beekeeper = await beekeeper_collection.find_one({"_id": ObjectId(beekeeper_id)})

    if not beekeeper:
        raise HTTPException(status_code=404, detail="Beekeeper not found")

    return BecknProviderResponse(
        id=f"beekeeper_{beekeeper_id}",
        descriptor=Descriptor(name=beekeeper["name"]),
        locations=[
            Location(
                id=f"loc_{beekeeper_id}",
                gps=beekeeper["gps"],
                address=Address(**beekeeper["address"])
            )
        ],
        tags={
            "species": beekeeper.get("species", []),
            "certifications": beekeeper.get("certifications", [])
        }
    )
