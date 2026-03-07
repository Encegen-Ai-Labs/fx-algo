from flask import Blueprint, request
from models.order import Order
from extensions import db
from datetime import datetime

telegram_bp = Blueprint("telegram", __name__)


@telegram_bp.post("/telegram/webhook")
def telegram_webhook():

    data = request.json

    if "callback_query" not in data:
        return {"ok": True}

    callback = data["callback_query"]

    action = callback["data"]

    if action.startswith("approve_"):

        order_id = int(action.split("_")[1])

        order = Order.query.get(order_id)

        if order:
            order.payment_status = "paid"
            order.status = "paid"
            order.verified_at = datetime.utcnow()

            db.session.commit()

    elif action.startswith("reject_"):

        order_id = int(action.split("_")[1])

        order = Order.query.get(order_id)

        if order:
            order.payment_status = "rejected"

            db.session.commit()

    return {"ok": True}