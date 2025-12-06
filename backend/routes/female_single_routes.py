from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from extensions import db
from models import FemaleSingle
from schemas import FemaleSingleSchema

female_singles_bp = Blueprint("female_singles", __name__)

female_schema = FemaleSingleSchema()
female_list_schema = FemaleSingleSchema(many=True)


@female_singles_bp.get("")
@login_required
def get_female_singles():
    females = FemaleSingle.query.filter_by(user_id=current_user.id).all()
    return jsonify(female_list_schema.dump(females)), 200


@female_singles_bp.get("/<int:id>")
@login_required
def get_female_single(id):
    f = FemaleSingle.query.filter_by(id=id, user_id=current_user.id).first()
    if not f:
        return jsonify({"error": "Female single not found"}), 404
    return jsonify(female_schema.dump(f)), 200


@female_singles_bp.post("")
@login_required
def create_female_single():
    data = request.json or {}
    required = ["first_name", "last_name", "age"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        f = FemaleSingle(
            first_name=data["first_name"],
            last_name=data["last_name"],
            age=int(data["age"]),
            gender=data.get("gender") or "Female",
            location=data.get("location"),
            phone_number=data.get("phone_number"),
            notes=data.get("notes"),
            user_id=current_user.id,
        )
        db.session.add(f)
        db.session.commit()
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

    return jsonify(female_schema.dump(f)), 201
