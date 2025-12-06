from flask import Blueprint, request, jsonify
from flask_login import login_required
from extensions import db
from models import MaleSingle
from schemas import MaleSingleSchema

male_singles_bp = Blueprint("male_singles", __name__, url_prefix="/male_singles")
male_schema = MaleSingleSchema()
male_list_schema = MaleSingleSchema(many=True)


@male_singles_bp.get("")
@login_required
def get_male_singles():
    males = MaleSingle.query.all()
    return jsonify(male_list_schema.dump(males)), 200


@male_singles_bp.get("/<int:id>")
@login_required
def get_male_single(id):
    m = MaleSingle.query.get(id)
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

    m = MaleSingle(**data)
    db.session.add(m)
    db.session.commit()

    return jsonify(male_schema.dump(m)), 201
