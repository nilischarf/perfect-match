from flask import Blueprint, request, jsonify
from flask_login import login_required
from extensions import db
from models import FemaleSingle
from schemas import FemaleSingleSchema

female_singles_bp = Blueprint("female_singles", __name__, url_prefix="/female_singles")
female_schema = FemaleSingleSchema()
female_list_schema = FemaleSingleSchema(many=True)


@female_singles_bp.get("")
@login_required
def get_female_singles():
    return jsonify(female_list_schema.dump(FemaleSingle.query.all())), 200


@female_singles_bp.get("/<int:id>")
@login_required
def get_female_single(id):
    f = FemaleSingle.query.get(id)
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

    f = FemaleSingle(**data)
    db.session.add(f)
    db.session.commit()
    return jsonify(female_schema.dump(f)), 201


@female_singles_bp.patch("/<int:id>")
@login_required
def update_female_single(id):
    f = FemaleSingle.query.get(id)
    if not f:
        return jsonify({"error": "Female single not found"}), 404

    for key, val in (request.json or {}).items():
        if hasattr(f, key):
            setattr(f, key, val)

    db.session.commit()
    return jsonify(female_schema.dump(f)), 200


@female_singles_bp.delete("/<int:id>")
@login_required
def delete_female_single(id):
    f = FemaleSingle.query.get(id)
    if not f:
        return jsonify({"error": "Female single not found"}), 404

    db.session.delete(f)
    db.session.commit()
    return jsonify({"message": "Female single deleted"}), 200
