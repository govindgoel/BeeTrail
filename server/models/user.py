# models/user.py
from pydantic import BaseModel
from typing import Literal

class OTPRequest(BaseModel):
    mobileNumber: str
    userRole: Literal["farmer", "beekeeper"]

class OTPVerify(BaseModel):
    mobileNumber: str
    otp: str
    userRole: Literal["farmer", "beekeeper"]
