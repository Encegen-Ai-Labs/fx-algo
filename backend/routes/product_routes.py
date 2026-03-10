from flask import Blueprint, request, jsonify
from extensions import db
from models.product import Product
from utils.admin_required import admin_required

import os
import uuid
from werkzeug.utils import secure_filename

product_bp = Blueprint("products", __name__)

IMAGE_FOLDER = "uploads/images"
FILE_FOLDER = "uploads/files"

os.makedirs(IMAGE_FOLDER, exist_ok=True)
os.makedirs(FILE_FOLDER, exist_ok=True)


# ---------------------------
# PUBLIC ROUTES (CUSTOMERS)
# ---------------------------

# GET ALL PRODUCTS
@product_bp.get("/")
def all_products():
    products = Product.query.all()

    return jsonify([
        {
            "id": p.id,
            "title": p.title,
            "price": p.price,
            "image": p.image,
            "discount": p.discount,
            "old_price": p.old_price
        }
        for p in products
    ])


# GET SINGLE PRODUCT
@product_bp.get("/<int:id>")
def single_product(id):

    p = Product.query.get_or_404(id)

    return jsonify({
        "id": p.id,
        "title": p.title,
        "description": p.description,
        "price": p.price,
        "old_price": p.old_price,
        "discount": p.discount,
        "image": p.image,
        "file_url": p.file_url
    })


# ---------------------------
# ADMIN ROUTES
# ---------------------------

# CREATE PRODUCT
@product_bp.post("/")
@admin_required
def add_product():

    try:

        title = request.form.get("title")
        description = request.form.get("description")
        price = request.form.get("price")

        if not title or not price:
            return jsonify({"error": "Title and price required"}), 400

        discount = request.form.get("discount", 0)
        old_price = request.form.get("old_price", 0)

        # ---------------- IMAGE ----------------
        image_file = request.files.get("image")
        image_path = None

        if image_file:

            filename = secure_filename(image_file.filename)
            filename = f"{uuid.uuid4()}_{filename}"

            save_path = os.path.join(IMAGE_FOLDER, filename)
            image_file.save(save_path)

            image_path = "/" + save_path.replace("\\", "/")


        # ---------------- BOT FILE ----------------
        bot_file = request.files.get("file")
        file_path = None

        if bot_file:

            filename = secure_filename(bot_file.filename)
            filename = f"{uuid.uuid4()}_{filename}"

            save_path = os.path.join(FILE_FOLDER, filename)
            bot_file.save(save_path)

            file_path = "/" + save_path.replace("\\", "/")


        product = Product(
            title=title,
            description=description,
            price=float(price),
            discount=int(discount),
            old_price=float(old_price),
            image=image_path,
            file_url=file_path
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({
            "message": "Product created successfully",
            "id": product.id
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500


# ---------------------------
# UPDATE PRODUCT
# ---------------------------

@product_bp.put("/<int:id>")
@admin_required
def update_product(id):

    try:

        product = Product.query.get_or_404(id)

        product.title = request.form.get("title", product.title)
        product.description = request.form.get("description", product.description)

        if request.form.get("price"):
            product.price = float(request.form.get("price"))

        if request.form.get("old_price"):
            product.old_price = float(request.form.get("old_price"))

        if request.form.get("discount"):
            product.discount =  float(request.form.get("discount"))


        # ---------------- IMAGE UPDATE ----------------
        image_file = request.files.get("image")

        if image_file:

            # delete old image
            if product.image:
                old_path = product.image.lstrip("/")
                if os.path.exists(old_path):
                    os.remove(old_path)

            filename = secure_filename(image_file.filename)
            filename = f"{uuid.uuid4()}_{filename}"

            save_path = os.path.join(IMAGE_FOLDER, filename)
            image_file.save(save_path)

            product.image = "/" + save_path.replace("\\", "/")


        # ---------------- FILE UPDATE ----------------
        bot_file = request.files.get("file")

        if bot_file:

            if product.file_url:
                old_path = product.file_url.lstrip("/")
                if os.path.exists(old_path):
                    os.remove(old_path)

            filename = secure_filename(bot_file.filename)
            filename = f"{uuid.uuid4()}_{filename}"

            save_path = os.path.join(FILE_FOLDER, filename)
            bot_file.save(save_path)

            product.file_url = "/" + save_path.replace("\\", "/")


        db.session.commit()

        return jsonify({
            "message": "Product updated successfully"
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500


# ---------------------------
# DELETE PRODUCT
# ---------------------------

@product_bp.delete("/<int:id>")
@admin_required
def delete_product(id):

    try:

        product = Product.query.get_or_404(id)

        # delete image
        if product.image:
            path = product.image.lstrip("/")
            if os.path.exists(path):
                os.remove(path)

        # delete file
        if product.file_url:
            path = product.file_url.lstrip("/")
            if os.path.exists(path):
                os.remove(path)

        db.session.delete(product)
        db.session.commit()

        return jsonify({
            "message": "Product deleted successfully"
        })

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 500