import os
import hmac
import hashlib
import razorpay

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from datetime import datetime

from config import Config
from extensions import db
from models.order import Order

from utils.telegram import send_admin_alert, send_admin_photo


payment_bp = Blueprint("payment", __name__)

client = razorpay.Client(
    auth=(Config.RAZORPAY_KEY_ID, Config.RAZORPAY_KEY_SECRET)
)

UPLOAD_FOLDER = "uploads/payment_proofs"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ---------------- CREATE RAZORPAY ORDER ----------------

@payment_bp.post("/create-order")
def create_order():

    data = request.json
    order_id = data.get("order_id")
    amount = int(data.get("amount"))

    razorpay_order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1,
        "notes": {"order_id": order_id}
    })

    order = Order.query.get(order_id)

    if not order:
        return {"error": "Order not found"}, 404

    order.razorpay_order_id = razorpay_order["id"]

    db.session.commit()

    return jsonify({
        "key": Config.RAZORPAY_KEY_ID,
        "razorpay_order_id": razorpay_order["id"],
        "amount": razorpay_order["amount"]
    })

# ---------------- VERIFY PAYPAL PAYMENT ----------------

@payment_bp.post("/paypal-verify")
def verify_paypal_payment():

    data = request.json

    order_id = data.get("order_id")
    paypal_order_id = data.get("paypal_order_id")

    if not order_id or not paypal_order_id:
        return {"error": "Invalid data"}, 400

    order = Order.query.get(order_id)

    if not order:
        return {"error": "Order not found"}, 404

    # Update order
    order.status = "paid"
    order.payment_status = "paid"
    order.paypal_order_id = paypal_order_id
    order.verified_at = datetime.utcnow()

    db.session.commit()

    # 🔔 TELEGRAM ALERT
    send_admin_alert(
f"""
💰 <b>PayPal Payment Received</b>

<b>Order ID:</b> #{order.id}
<b>Amount:</b> ${order.total_amount}

<b>PayPal Order ID:</b>
{paypal_order_id}

Status: <b>PAID</b>
"""
    )

    return {"message": "PayPal payment verified"}
# ---------------- VERIFY RAZORPAY PAYMENT ----------------

@payment_bp.post("/verify")
def verify_payment():

    data = request.json

    order_id = data["order_id"]
    razorpay_order_id = data["razorpay_order_id"]
    razorpay_payment_id = data["razorpay_payment_id"]
    razorpay_signature = data["razorpay_signature"]

    generated_signature = hmac.new(
        bytes(Config.RAZORPAY_KEY_SECRET, "utf-8"),
        bytes(razorpay_order_id + "|" + razorpay_payment_id, "utf-8"),
        hashlib.sha256
    ).hexdigest()

    if generated_signature != razorpay_signature:
        return {"error": "Invalid payment"}, 400

    order = Order.query.get(order_id)

    if not order:
        return {"error": "Order not found"}, 404

    order.status = "paid"
    order.payment_status = "paid"
    order.razorpay_payment_id = razorpay_payment_id
    order.razorpay_signature = razorpay_signature
    order.verified_at = datetime.utcnow()

    db.session.commit()

    # 🔔 TELEGRAM ALERT
    send_admin_alert(
f"""
💰 <b>Razorpay Payment Received</b>

<b>Order ID:</b> #{order.id}
<b>Amount:</b> ₹{order.total_amount}

<b>Payment ID:</b>
{razorpay_payment_id}

Status: <b>PAID</b>
"""
    )

    return {"message": "Payment verified"}


# ---------------- MANUAL PAYMENT SCREENSHOT ----------------

@payment_bp.post("/upload-proof/<int:order_id>")
def upload_proof(order_id):

    order = Order.query.get(order_id)

    if not order:
        return {"error": "Order not found"}, 404

    file = request.files.get("screenshot")

    if not file:
        return {"error": "Screenshot required"}, 400

    filename = secure_filename(f"order_{order_id}_{file.filename}")
    path = os.path.join(UPLOAD_FOLDER, filename)

    file.save(path)

    order.payment_proof = path
    order.payment_status = "pending_verification"

    db.session.commit()

    # 🔔 TELEGRAM ALERT WITH SCREENSHOT
    send_admin_photo(
        path,
f"""
📸 <b>Manual Payment Uploaded</b>

<b>Order ID:</b> #{order.id}
<b>Amount:</b> ₹{order.total_amount}

<b>Customer:</b>
{order.email}

Please verify payment screenshot.
""",
buttons=[
[
{"text": "Approve ✅", "callback_data": f"approve_{order.id}"},
{"text": "Reject ❌", "callback_data": f"reject_{order.id}"}
]
]
)

    return {"message": "Payment proof uploaded"}