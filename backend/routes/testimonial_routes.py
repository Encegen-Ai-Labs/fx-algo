from flask import Blueprint, request, jsonify
from extensions import db
from models.testimonial import Testimonial
from utils.admin_required import admin_required
import os
import uuid
from werkzeug.utils import secure_filename

testimonial_bp = Blueprint("testimonials", __name__, url_prefix="/api/testimonials")

UPLOAD_FOLDER = "uploads/videos"
ALLOWED_EXTENSIONS = {"mp4", "mov", "webm"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ---------------- FILE VALIDATION ----------------
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# -------------------- READ (PUBLIC) --------------------
@testimonial_bp.route("/", methods=["GET"])
def get_testimonials():

    items = Testimonial.query.order_by(Testimonial.id.desc()).all()

    data = []
    for t in items:

        video_url = "/" + t.video.replace("\\", "/") if t.video else None

        data.append({
            "id": t.id,
            "name": t.name,
            "country": t.country,
            "flag": t.flag,
            "reward": t.reward,
            "role": t.role,
            "youtube": t.youtube,
            "video": video_url
        })

    return jsonify(data)


# -------------------- CREATE (ADMIN) --------------------
@testimonial_bp.route("/", methods=["POST"])
@admin_required
def add_testimonial():

    file = request.files.get("video")
    youtube = request.form.get("youtube")

    video_path = None

    # Handle uploaded video file
    if file and file.filename != "" and allowed_file(file.filename):

        ext = file.filename.rsplit(".", 1)[1].lower()
        filename = f"{uuid.uuid4()}.{ext}"

        filepath = os.path.join(UPLOAD_FOLDER, filename)

        file.save(filepath)

        video_path = f"uploads/videos/{filename}"

    # Require either video file or youtube link
    if not video_path and not youtube:
        return jsonify({"error": "Video or YouTube link required"}), 400

    t = Testimonial(
        name=request.form.get("name"),
        country=request.form.get("country"),
        flag=request.form.get("flag"),
        reward=request.form.get("reward"),
        role=request.form.get("role"),
        youtube=youtube,
        video=video_path
    )

    db.session.add(t)
    db.session.commit()

    return jsonify({"message": "Testimonial added"})


# -------------------- UPDATE (ADMIN) --------------------
@testimonial_bp.route("/<int:id>", methods=["PUT"])
@admin_required
def update_testimonial(id):

    t = Testimonial.query.get_or_404(id)

    t.name = request.form.get("name")
    t.country = request.form.get("country")
    t.flag = request.form.get("flag")
    t.reward = request.form.get("reward")
    t.role = request.form.get("role")
    t.youtube = request.form.get("youtube")

    file = request.files.get("video")

    if file and allowed_file(file.filename):

        # delete old file
        if t.video and os.path.exists(t.video):
            os.remove(t.video)

        ext = file.filename.rsplit(".", 1)[1].lower()
        filename = f"{uuid.uuid4()}.{ext}"

        filepath = os.path.join(UPLOAD_FOLDER, filename)

        file.save(filepath)

        t.video = f"uploads/videos/{filename}"

    db.session.commit()

    return jsonify({"message": "Updated"})


# -------------------- DELETE (ADMIN) --------------------
@testimonial_bp.route("/<int:id>", methods=["DELETE"])
@admin_required
def delete_testimonial(id):

    t = Testimonial.query.get_or_404(id)

    if t.video and os.path.exists(t.video):
        os.remove(t.video)

    db.session.delete(t)
    db.session.commit()

    return jsonify({"message": "Deleted"})
