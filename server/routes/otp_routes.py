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

    if data.userRole == "farmer":
        #check if the user already exists
        data = await farmer_collection.find_one({"mobileNumber": data.mobileNumber})
        if not data:
            result = await farmer_collection.insert_one(user_doc)
            await otp_collection.delete_one({"mobileNumber": data.mobileNumber})
    elif data.userRole == "beekeeper":
        data = await beekeeper_collection.find_one({"mobileNumber": data.mobileNumber})
        if not data:
            result = await beekeeper_collection.insert_one(user_doc)
            await otp_collection.delete_one({"mobileNumber": data.mobileNumber})
    else:
        raise HTTPException(status_code=400, detail="Invalid user role")


    return {
        "message": f"Login successfully",
        "userRole": data.get("userRole",""),
        "data": data,
        "id": str(result.inserted_id)
    }
