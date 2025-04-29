from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from routes.beekeeper_routes import beekeeper_router
from routes.farmer_routes import farmer_router
from routes.rating_routes import rating_router
from routes.quote_routes import quote_router
from routes.order_routes import order_router
from routes.matchmaking_routes import matchmaking_router

# from routes.route_planner_routes import route_planner_router

app = FastAPI(
    title="Bee-Pollination Beckn API Wrapper",
    description="Built following the Beckn Protocol standards. Core Version: 0.9.4 | Domain: beckn.org/farmer",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

app.root_path = "/api/v1"

origins = [
    "*"  # React app
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registering the routers for each feature
app.include_router(beekeeper_router, prefix="/beekeeper", tags=["Beekeepers"])
app.include_router(farmer_router, prefix="/farmer", tags=["Farmers"])
app.include_router(rating_router, prefix="/rating", tags=["Ratings"])
app.include_router(quote_router, prefix="/quote", tags=["Quotes"])
app.include_router(order_router, prefix="/order", tags=["Orders"])
app.include_router(matchmaking_router, prefix="/matchmaking", tags=["Matchmaking"])
# app.include_router(route_planner_router, prefix="/route-planner", tags=["Route Planner"])


@app.get("/")
async def root():
    return {"message": "Welcome to the Bee-Pollination Beckn API Wrapper!"}

@app.get("/protocol/discover")
async def discover_protocol():
    return {
        "domain": "beckn.org/farmer",
        "core_version": "0.9.4",
        "actions_supported": [
            "search", "select", "init", "confirm", "status", "track", "support"
        ],
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }


# Run the server using uvicorn when the script is executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8008)
