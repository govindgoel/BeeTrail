from fastapi import APIRouter, HTTPException
from typing import List
from models.order_models import OrderRequest, OrderResponse
from db import order_collection, matchmaking_collection, beekeeper_collection
from datetime import datetime, timedelta
from bson import ObjectId
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import black
import os
import requests
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

# Create a directory to store PDF contracts (if it doesn't exist)
if not os.path.exists('contracts'):
    os.makedirs('contracts')

SERVER_URL = "http://135.235.166.1:8008"  # Replace with your server URL
order_router = APIRouter()

# Helper function to generate the PDF contract
def generate_contract_pdf(order_data: dict, order_id: str, match_data: dict, provider_name, provider_contact):
    # Create a file-like object to save the PDF in memory
    pdf_buffer = BytesIO()

    # Create a canvas object
    c = canvas.Canvas(pdf_buffer, pagesize=letter)

    # Set the background color to #fff6e5 (light yellow)
    c.setFillColorRGB(1, 0.96, 0.9)  # RGB for #fff6e5
    c.rect(0, 0, 612, 792, fill=True, stroke=False)  # Fill the whole page

    # Set text color to black
    c.setFillColor(black)

    # Define the top margin
    top_margin = 50

    # Title heading of the PDF (prominently at the top)
    c.setFont("Helvetica-Bold", 12)
    title = f"BeeTrail Contract for Order #{order_id}"
    c.drawString(50, 780 - top_margin, title)

    # Set the starting Y position after the title (below the margin)
    y_position = 760 - top_margin

    # Title beetrail (introductory description) just below the title heading
    c.setFont("Helvetica", 8)
    description = (
        "This contract outlines the terms and conditions for the service "
        "provided by the beekeeper to the farm based on the request. "
    )
    y_position -= 10  # Move down for description
    c.drawString(50, y_position, description)

    # Adjust y_position for table
    y_position -= 250  # Move further down to avoid overlap with description

    # Details (create table for order details)
    table_data = [
        ['BeeTrail Contract Details', ''],
        ['Order ID', order_id],
        ['Provider', provider_name],
        ['Bee Box Count', match_data.get('bee_box_count', 'N/A')],
        ['Total Quote', f"{order_data['price']['value']} {order_data['price']['currency']}"],
        ['Payment Status', order_data.get('payment_status', 'pending')],
        ['Order State', order_data.get('order_state', 'N/A')],
        ['Payment Method', order_data.get('payment_method', 'N/A')],
        ['Time to Expire (TTL)', '2 days']
    ]

    # Create the table
    table = Table(table_data, colWidths=[150, 300])

    # Style the table
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    # Add table to the PDF
    table.wrapOn(c, 100, y_position)
    table.drawOn(c, 50, y_position - 50)  # Adjust this to control the position of the table

    # Beetrail (footer with provider's contact and timestamp)
    y_position -= 80  # Move further down for footer
    c.setFont("Helvetica-Oblique", 8)
    c.drawString(50, 50, f"Generated on: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}")
    c.drawString(50, 30, f"Provider Contact: {provider_name}, {provider_contact if provider_contact else 'Not Available'}")

    # Save the PDF
    c.save()

    # Move to the beginning of the StringIO buffer
    pdf_buffer.seek(0)

    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "contracts"))
    pdf_filename = os.path.join(base_path, f"{order_id}_contract.pdf")

    # Save PDF to a file
    with open(pdf_filename, 'wb') as f:
        print(f"Saving contract PDF to {pdf_filename}")
        f.write(pdf_buffer.read())

    return pdf_filename

# Function to integrate with the payment gateway
def initiate_payment(order_data: dict):
    # This is a placeholder for the actual PG integration logic
    pg_url = "https://payment-gateway-url.com/api/payment"  # Replace with actual PG URL
    pg_payload = {
        "order_id": order_data["id"],
        "amount": order_data["price"]["value"],
        "currency": "INR",
        "return_url": f"https://yourapp.com/return/{order_data['id']}",  # URL to handle PG callback
        "customer_email": order_data["payment"]["customer_email"]
    }

    # Make a POST request to initiate payment
    response = requests.post(pg_url, data=pg_payload)

    # Check response from PG
    if response.status_code == 200:
        payment_response = response.json()
        if payment_response["status"] == "success":
            return payment_response["payment_link"]
        else:
            raise HTTPException(status_code=400, detail="Payment initiation failed")
    else:
        raise HTTPException(status_code=500, detail="Failed to connect to payment gateway")

# Route to create a new order and process payment
@order_router.post("/create", response_model=OrderResponse)
async def create_order(data: OrderRequest):
    existing_order = await order_collection.find_one({"matchmaking_id": data.matchmaking_id})
    if existing_order and existing_order["ttl"] > datetime.utcnow():
        raise HTTPException(status_code=400, detail="Order already exists for this matchmaking ID")

    #check if matchmaking_id exists
    match_data = await matchmaking_collection.find_one({"_id": ObjectId(data.matchmaking_id)})
    print(match_data)
    if not match_data or match_data["is_active"] == False:
        raise HTTPException(status_code=404, detail="Matchmaking ID not found")
    
    #find beekeeper 
    beekeeper = await beekeeper_collection.find_one({"_id": ObjectId(match_data["beekeeper_id"])})

    # Create the order document
    order_doc = data.dict()
    order_doc["is_accepted"] = data.payment_method == "cash"  # If payment method is cash, accept the order immediately

    # If payment is online, initiate the payment process
    if data.payment_method == "online":
        try:
            payment_link = initiate_payment(order_doc)
            order_doc["payment_link"] = payment_link  # Add the payment link to the order document
        except HTTPException as e:
            raise e
    else:
        order_doc["payment_link"] = None  # For cash payment, no payment link

    order_doc["ttl"] = datetime.utcnow() + timedelta(days=2)  # Set TTL for 2 days
    order_doc["created_at"] = datetime.utcnow()
    # Insert the order into the collection
    result = await order_collection.insert_one(order_doc)
    order_id = result.inserted_id

    order_doc["contract_pdf_url"] = f"{SERVER_URL}/contracts/{order_id}_contract.pdf"  # Placeholder for contract PDF URL

    # Update the order in the database with the payment link (for online payments)
    await order_collection.update_one({"_id": order_id}, {"$set": order_doc})

    # Generate contract PDF after creating the order
    provider_name = beekeeper.get("name", "Beekeeper")
    provider_contact = beekeeper.get("mobileNumber")
    contract_pdf_url = generate_contract_pdf(order_doc, order_id, match_data, provider_name,provider_contact)

    # Return the order response along with the contract PDF path (or URL)
    return OrderResponse(
        id=str(order_id),
        **order_doc,
    )


# Route to get the order details along with the contract PDF URL
@order_router.get("/get/{order_id}", response_model=OrderResponse)
async def get_order(order_id: str):
    order = await order_collection.find_one({"id": order_id})

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Construct the contract PDF URL
    contract_pdf_url = f"/contracts/{order_id}_contract.pdf"
    
    return OrderResponse(
        id=order["id"],
        provider=order["provider"],
        items=order["items"],
        fulfillment=order["fulfillment"],
        quote=order["quote"],
        payment=order["payment"],
        state=order["state"],
        created_at=order["created_at"],
        contract_pdf_url=contract_pdf_url,  # Include the contract PDF URL
        payment_link=order["payment"].get("payment_link", "")  # Include the payment link
    )
