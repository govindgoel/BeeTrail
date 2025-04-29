# routes/otp.py
from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import random
from models.user import OTPRequest, OTPVerify
from db import otp_collection, beekeeper_collection, farmer_collection

otp_router = APIRouter()

@otp_router.post("/send-otp")
async def send_otp(data: OTPRequest):
    otp = str(random.randint(100000, 999999))
    otp = 132459  # For testing purposes, use a fixed OTP
    expires_at = datetime.utcnow() + timedelta(minutes=5)

    # Upsert OTP
    await otp_collection.update_one(
        {"mobileNumber": data.mobileNumber},
        {
            "$set": {
                "otp": otp,
                "expires_at": expires_at,
                "userRole": data.userRole,
                "created_at": datetime.utcnow()
            }
        },
        upsert=True
    )

    print(f"OTP sent to {data.mobileNumber}: {otp}")  # Replace with SMS gateway
    return {"message": "OTP sent successfully"}


# Helper to serialize MongoDB documents
def serialize_mongo_doc(doc):
    if not doc:
        return None
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@otp_router.post("/verify-otp")
async def verify_otp(data: OTPVerify):
    otp_doc = await otp_collection.find_one({"mobileNumber": data.mobileNumber})
    print(otp_doc, data)

    if not otp_doc or str(otp_doc["otp"]) != str(data.otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if datetime.utcnow() > otp_doc["expires_at"]:
        await otp_collection.delete_one({"mobileNumber": data.mobileNumber})
        raise HTTPException(status_code=400, detail="OTP expired")

    user_doc = {
        "mobileNumber": data.mobileNumber,
        "userRole": data.userRole,
        "created_at": datetime.utcnow()
    }

    user_data = None

    if data.userRole == "farmer":
        user_data = await farmer_collection.find_one({"mobileNumber": data.mobileNumber})
        if not user_data:
            result = await farmer_collection.insert_one(user_doc)
            user_data = user_doc or {"_id": result.inserted_id}
            await otp_collection.delete_one({"mobileNumber": data.mobileNumber})

    elif data.userRole == "beekeeper":
        user_data = await beekeeper_collection.find_one({"mobileNumber": data.mobileNumber})
        if not user_data:
            result = await beekeeper_collection.insert_one(user_doc)
            user_data = user_doc or {"_id": result.inserted_id}
            await otp_collection.delete_one({"mobileNumber": data.mobileNumber})
    else:
        raise HTTPException(status_code=400, detail="Invalid user role")

    return {
        "message": "Login successfully",
        "userRole": user_data.get("userRole", ""),
        "data": serialize_mongo_doc(user_data),
        "id": str(user_data["_id"])
    }