# db.py
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb+srv://govind:J58dnKuJhfQ14FtY@pragati.eecnkq1.mongodb.net/?retryWrites=true&w=majority&appName=pragati")
db = client["beetrail"] 

beekeeper_collection = db["beekeepers"]

farmer_collection = db["farmers"]

farms_collection = db["farms"]

matchmaking_collection = db["matchmaking_requests"]

fulfillment_collection = db["fulfillment_requests"]

quote_collection = db["quotes"]

order_collection = db["orders"]

rating_collection = db["ratings"]

otp_collection = db["otp"]
