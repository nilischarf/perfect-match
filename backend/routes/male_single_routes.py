from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from extensions import db
from models import MaleSingle
from schemas import MaleSingleSchema

male_singles_bp = Blueprint("male_singles", __name__)

male_schema = MaleSingleSchema()
male_list_schema = MaleSingleSchema(many=True)


@male_singles_bp.get("")
@login_required
def get_all_male_singles():
    males = MaleSingle.query.filter_by(user_id=current_user.id).all()
    return jsonify(male_list_schema.dump(males)), 200


@male_singles_bp.get("/<int:id>")
@login_required
def get_male_single(id):
    m = MaleSingle.query.filter_by(id=id, user_id=current_user.id).first()
    if not m:
        return jsonify({"error": "Male single not found"}), 404
    return jsonify(male_schema.dump(m)), 200


@male_singles_bp.post("")
@login_required
def create_male_single():
    data = request.json or {}

    required = ["first_name", "last_name", "age"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        m = MaleSingle(
            first_name=data["first_name"],
            last_name=data["last_name"],
            age=int(data["age"]),
            gender=data.get("gender") or "Male",
            location=data.get("location"),
            phone_number=data.get("phone_number"),
            notes=data.get("notes"),
            user_id=current_user.id,
        )
        db.session.add(m)
        db.session.commit()
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

    return jsonify(male_schema.dump(m)), 201
