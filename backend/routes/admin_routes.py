from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db

from datetime import datetime

from models.user import User
from models.order import Order
from models.product import Product
from models.license import License
from models.order_item import OrderItem

from utils.license_generator import generate_license_key
from utils.telegram import send_admin_alert


admin_bp = Blueprint("admin", __name__)


# ---------------- ADMIN CHECK ----------------

def admin_only():

    user_id = get_jwt_identity()

    if not user_id:
        return False

    user = User.query.get(user_id)

    return user and user.role == "superadmin"


# ---------------- GET ALL ORDERS ----------------

@admin_bp.get("/orders")
@jwt_required()
def admin_orders():

    if not admin_only():
        return {"error": "Admin only"}, 403

    orders = Order.query.order_by(Order.id.desc()).all()

    result = []

    for o in orders:

        result.append({
            "id": o.id,
            "userId": o.user_id,

            "first_name": o.first_name,
            "last_name": o.last_name,
            "email": o.email,
            "phone": o.phone,

            "country": o.country,
            "address": o.address,
            "postal_code": o.postal_code,
            "coupon_code": o.coupon_code,

            "total": o.total_amount,

            "payment_method": o.payment_method,
            "payment_status": o.payment_status,
            "payment_proof": o.payment_proof,

            "createdAt": o.created_at.strftime("%Y-%m-%d %H:%M")
        })

    return result

# ---------------- DASHBOARD STATS ----------------

@admin_bp.get("/stats")
@jwt_required()
def admin_stats():

    if not admin_only():
        return {"error": "Admin only"}, 403

    total_products = Product.query.count()
    total_users = User.query.count()
    total_orders = Order.query.filter_by(status="paid").count()

    revenue = db.session.query(db.func.sum(Order.total_amount)).filter_by(status="paid").scalar()
    revenue = revenue or 0

    return {
        "products": total_products,
        "users": total_users,
        "orders": total_orders,
        "revenue": revenue
    }


# ---------------- ALL USERS ----------------

@admin_bp.get("/users")
@jwt_required()
def get_users():

    if not admin_only():
        return {"error": "Admin only"}, 403

    users = User.query.all()

    result = []

    for u in users:

        paid_orders = Order.query.filter_by(user_id=u.id, status="paid").all()

        order_count = len(paid_orders)

        total_spent = sum([o.total_amount for o in paid_orders]) if paid_orders else 0

        result.append({
            "id": u.id,
            "email": u.email,
            "orders": order_count,
            "spent": total_spent
        })

    return result


# ---------------- USER DETAIL ----------------

@admin_bp.get("/users/<int:user_id>")
@jwt_required()
def user_detail(user_id):

    if not admin_only():
        return {"error": "Admin only"}, 403

    user = User.query.get_or_404(user_id)

    orders = Order.query.filter_by(user_id=user_id).all()
    licenses = License.query.filter_by(user_id=user_id).all()

    order_data = []

    for o in orders:

        order_data.append({
            "order_id": o.id,
            "amount": o.total_amount,
            "status": o.status,
            "date": str(o.created_at)
        })

    license_data = []

    for l in licenses:

        product = Product.query.get(l.product_id)

        license_data.append({
            "product": product.title if product else "Deleted Product",
            "key": l.license_key,
            "active": l.active
        })

    return {
        "email": user.email,
        "orders": order_data,
        "licenses": license_data
    }


# ---------------- APPROVE PAYMENT ----------------

@admin_bp.post("/approve-payment/<int:order_id>")
@jwt_required()
def approve_payment(order_id):

    if not admin_only():
        return {"error": "Admin only"}, 403

    order = Order.query.get(order_id)

    if not order:
        return {"error": "Order not found"}, 404

    order.payment_status = "paid"
    order.status = "paid"
    order.verified_at = datetime.utcnow()

    # 🔑 Generate license keys
    items = OrderItem.query.filter_by(order_id=order.id).all()

    for item in items:

        license = License(
            user_id=order.user_id,
            product_id=item.product_id,
            license_key=generate_license_key(),
            active=True
        )

        db.session.add(license)

    db.session.commit()

    # 🔔 TELEGRAM ALERT
    send_admin_alert(
f"""
✅ Payment Approved

Order ID: #{order.id}
Amount: ${order.total_amount}

License Generated
"""
    )

    return {"message": "Payment approved"}


# ---------------- REJECT PAYMENT ----------------

@admin_bp.post("/reject-payment/<int:order_id>")
@jwt_required()
def reject_payment(order_id):

    if not admin_only():
        return {"error": "Admin only"}, 403

    order = Order.query.get(order_id)

    if not order:
        return {"error": "Order not found"}, 404

    order.payment_status = "rejected"

    db.session.commit()

    # 🔔 TELEGRAM ALERT
    send_admin_alert(
f"""
❌ Payment Rejected

Order ID: #{order.id}
Amount: ${order.total_amount}
"""
    )

    return {"message": "Payment rejected"}