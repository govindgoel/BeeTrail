from fastapi import APIRouter, HTTPException
from typing import List
from models.order_models import OrderRequest, OrderResponse
from db import order_collection
from datetime import datetime
from bson import ObjectId
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os
import requests

# Create a directory to store PDF contracts (if it doesn't exist)
if not os.path.exists('contracts'):
    os.makedirs('contracts')

order_router = APIRouter()

# Helper function to generate the PDF contract
def generate_contract_pdf(order_data: dict, order_id: str):
    # Create a file-like object to save PDF in memory
    pdf_buffer = BytesIO()

    # Create a canvas object
    c = canvas.Canvas(pdf_buffer, pagesize=letter)
    
    # Title of the PDF
    c.setFont("Helvetica-Bold", 16)
    c.drawString(200, 750, f"Contract for Order {order_id}")
    
    # Order details
    c.setFont("Helvetica", 12)
    c.drawString(50, 700, f"Order ID: {order_id}")
    c.drawString(50, 680, f"Provider: {order_data['provider']['id']}")
    c.drawString(50, 660, f"Items: {', '.join([item['id'] for item in order_data['items']])}")
    c.drawString(50, 640, f"Total Quote: {order_data['quote']['price']['value']} INR")
    c.drawString(50, 620, f"Payment Status: {order_data['payment']['status']}")
    c.drawString(50, 600, f"State: {order_data['state']}")
    
    # Footer
    c.setFont("Helvetica-Oblique", 8)
    c.drawString(50, 50, f"Generated at {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Save the PDF
    c.save()
    
    # Move to the beginning of the StringIO buffer
    pdf_buffer.seek(0)
    
    # Save PDF to a file
    pdf_filename = f"contracts/{order_id}_contract.pdf"
    with open(pdf_filename, 'wb') as f:
        f.write(pdf_buffer.read())
    
    return pdf_filename

# Function to integrate with the payment gateway
def initiate_payment(order_data: dict):
    # This is a placeholder for the actual PG integration logic
    # Example: Sending request to PG's payment endpoint (this will vary depending on PG provider)
    
    pg_url = "https://payment-gateway-url.com/api/payment"  # Replace with actual PG URL
    pg_payload = {
        "order_id": order_data["id"],
        "amount": order_data["quote"]["price"]["value"],
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
            # Payment successfully initiated
            return payment_response["payment_link"]
        else:
            raise HTTPException(status_code=400, detail="Payment initiation failed")
    else:
        raise HTTPException(status_code=500, detail="Failed to connect to payment gateway")

# Route to create a new order and process payment
@order_router.post("/", response_model=OrderResponse)
async def create_order(data: OrderRequest):
    # Create the order document
    order_doc = data.dict()
    order_doc["created_at"] = datetime.utcnow()
    order_doc["id"] = f"booking_{str(ObjectId())}"

    result = await order_collection.insert_one(order_doc)
    order_id = order_doc["id"]

    # Initiate payment via the payment gateway
    try:
        payment_link = initiate_payment(order_doc)
    except HTTPException as e:
        raise e

    # Update order with payment link
    order_doc["payment"]["payment_link"] = payment_link
    await order_collection.update_one({"id": order_id}, {"$set": order_doc})

    # Generate contract PDF after creating the order
    contract_pdf_path = generate_contract_pdf(order_doc, order_id)
    
    # Return the order response along with the contract PDF path (or URL)
    return OrderResponse(
        id=order_id, 
        **order_doc,
        contract_pdf_url=f"/contracts/{order_id}_contract.pdf",  # Provide the PDF URL
        payment_link=payment_link  # Return the payment link in the response
    )

# Route to get the order details along with the contract PDF URL
@order_router.get("/{order_id}", response_model=OrderResponse)
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
