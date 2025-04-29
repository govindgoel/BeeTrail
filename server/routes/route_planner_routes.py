import requests
from transformers import AutoTokenizer, AutoModelForCausalLM
from fastapi import APIRouter, HTTPException
from geopy.distance import geodesic
from models.route_planner_models import RoutePlanRequest, RoutePlanResponse

# WeatherAPI to get current weather data
def get_weather_for_location(lat: float, lon: float):
    weather_api_key = "YOUR_WEATHER_API_KEY"  # Replace with your actual API key
    url = f"http://api.weatherapi.com/v1/current.json?key={weather_api_key}&q={lat},{lon}"
    response = requests.get(url)
    return response.json()

# Load LLaMA model
model_name = "meta-llama/Llama-2-7b-chat-hf"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# FastAPI Router
route_planner_router = APIRouter()

@route_planner_router.post("/plan-route")
async def plan_route(request: RoutePlanRequest):
    # Extract data from the request
    current_location = request.current_location
    blooming_sites = request.blooming_sites
    preferences = request.beekeeper_preferences

    # Get the GPS coordinates of the current location
    current_lat, current_lon = map(float, current_location.split(","))

    # Fetch weather data for each blooming site
    weather_data = []
    for site in blooming_sites:
        lat, lon = map(float, site.gps.split(","))
        weather = get_weather_for_location(lat, lon)
        weather_data.append({
            "site_id": site.id,
            "temperature": weather["current"]["temp_c"],  # Temperature in Celsius
            "humidity": weather["current"]["humidity"],  # Humidity percentage
            "condition": weather["current"]["condition"]["text"]  # Weather condition (e.g., Sunny, Rainy)
        })

    # Construct LLaMA prompt with weather data
    route_prompt = f"Given the beekeeper's current location {current_location}, suggest the best route based on the following blooming sites and weather conditions: "

    for site, weather in zip(blooming_sites, weather_data):
        route_prompt += f"Site {site.id} (GPS: {site.gps}, Flowering Stage: {site.flowering_stage}) has weather: {weather['condition']} with temperature {weather['temperature']}°C and humidity {weather['humidity']}%. "
    
    route_prompt += f"The beekeeper prefers {preferences['preference']}. Generate an optimized route and estimate the total travel time."

    # Use LLaMA to generate the optimized route
    inputs = tokenizer(route_prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=512, num_return_sequences=1)
    
    # Decode the output from LLaMA (assumed to be a list of site IDs in order)
    optimized_route = tokenizer.decode(outputs[0], skip_special_tokens=True).split(",")

    # Calculate the travel time and total distance using geodesic
    total_travel_time = 0
    total_distance = 0
    for i in range(len(optimized_route) - 1):
        start_coords = tuple(map(float, optimized_route[i].split(",")))
        end_coords = tuple(map(float, optimized_route[i+1].split(",")))
        distance = geodesic(start_coords, end_coords).kilometers
        total_distance += distance
        total_travel_time += distance / 50  # Assuming an average speed of 50 km/h for travel
    
    estimated_cost = total_distance * 10  # Example cost calculation based on distance

    # Return the optimized route and additional information
    return RoutePlanResponse(
        optimal_route=optimized_route,
        total_travel_time=total_travel_time,
        estimated_cost=estimated_cost
    )
