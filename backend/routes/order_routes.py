from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from extensions import db
from models.order import Order
from models.order_item import OrderItem
from models.product import Product

from utils.telegram import send_admin_alert


order_bp = Blueprint("orders", __name__)


# ---------------- GET SINGLE ORDER ----------------

# ---------------- GET SINGLE ORDER ----------------
@order_bp.get("/<int:order_id>")
@jwt_required()
def get_single_order(order_id):

    user_id = get_jwt_identity()

    order = Order.query.filter_by(id=order_id, user_id=user_id).first()

    if not order:
        return {"error": "Order not found"}, 404

    item = OrderItem.query.filter_by(order_id=order.id).first()

    product = None
    if item:
        product = Product.query.get(item.product_id)

    return jsonify({
        "id": order.id,
        "total": order.total_amount,
        "price": item.price if item else None,
        "quantity": item.quantity if item else 1,

        "status": order.status,
        "payment_status": order.payment_status,
        "payment_method": order.payment_method,

        "createdAt": order.created_at.strftime("%Y-%m-%d %H:%M"),

        "product": {
            "title": product.title if product else None,
            "image": product.image if product else None
        } if product else None,

        "billing": {
            "first_name": order.first_name,
            "last_name": order.last_name,
            "email": order.email,
            "phone": order.phone,
            "country": order.country,
            "address": order.address,
            "postal_code": order.postal_code
        }
    })
# ---------------- CREATE ORDER ----------------

@order_bp.post("/")
@jwt_required()
def create_order():

    user_id = get_jwt_identity()
    data = request.json

    items = data.get("items", [])
    billing = data.get("billing") or {}

    if not items:
        return {"error": "No items provided"}, 400

    total = 0
    order_items = []

    # calculate total
    for item in items:

        product = Product.query.get(item["product_id"])

        if not product:
            continue

        qty = int(item.get("quantity", 1))
        price = float(product.price)

        total += price * qty

        order_items.append({
            "product": product,
            "qty": qty,
            "price": price
        })

    if total == 0:
        return {"error": "Invalid products"}, 400


    # create order
    order = Order(
        user_id=user_id,
        total_amount=total,
        payment_method=data.get("payment_method"),
        status="pending",

        first_name=billing.get("first_name"),
        last_name=billing.get("last_name"),
        email=billing.get("email"),
        phone=billing.get("phone"),
        country=billing.get("country"),
        address=billing.get("address"),
        postal_code=billing.get("postal_code"),
        coupon_code=billing.get("coupon"),
    )

    db.session.add(order)
    db.session.flush()



    # create order items
    for item in order_items:

        order_item = OrderItem(
            order_id=order.id,
            product_id=item["product"].id,
            quantity=item["qty"],
            price=item["price"]
        )

        db.session.add(order_item)

    db.session.commit()


    # ---------------- TELEGRAM ALERT ----------------

    send_admin_alert(
f"""
🛒 <b>New Order Created</b>

<b>Order ID:</b> #{order.id}
<b>Amount:</b> ₹{total}

<b>Payment Method:</b> {order.payment_method}

<b>Customer Email:</b>
{order.email}
""",
buttons=[
[
{"text": "Approve ✅", "callback_data": f"approve_{order.id}"},
{"text": "Reject ❌", "callback_data": f"reject_{order.id}"}
],
[
{"text": "Open Admin Panel", "url": "http://localhost:5173/login"}
]
]
)


    return {
        "order_id": order.id,
        "amount": total
    }


# ---------------- USER ORDER LIST ----------------

@order_bp.get("/")
@jwt_required()
def get_orders():

    user_id = get_jwt_identity()

    orders = Order.query.filter_by(user_id=user_id)\
        .order_by(Order.id.desc())\
        .all()

    result = []

    for o in orders:

        result.append({
            "id": o.id,
            "total": o.total_amount,
            "status": o.status,
            "payment_status": o.payment_status,
            "createdAt": o.created_at.strftime("%Y-%m-%d %H:%M")
        })

    return jsonify(result)