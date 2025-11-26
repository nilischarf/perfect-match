from flask import Blueprint, request, jsonify
from flask_login import login_required
from extensions import db
from models import Matchmaker
from schemas import MatchmakerSchema

matchmakers_bp = Blueprint("matchmakers", __name__, url_prefix="/matchmakers")
matchmaker_schema = MatchmakerSchema()
matchmaker_list_schema = MatchmakerSchema(many=True)


@matchmakers_bp.get("")
@login_required
def get_matchmakers():
    return jsonify(matchmaker_list_schema.dump(Matchmaker.query.all())), 200


@matchmakers_bp.get("/<int:id>")
@login_required
def get_matchmaker(id):
    mk = Matchmaker.query.get(id)
    if not mk:
        return jsonify({"error": "Matchmaker not found"}), 404
    return jsonify(matchmaker_schema.dump(mk)), 200


@matchmakers_bp.post("")
@login_required
def create_matchmaker():
    data = request.json or {}

    required = ["name", "location"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    mk = Matchmaker(**data)
    db.session.add(mk)
    db.session.commit()
    return jsonify(matchmaker_schema.dump(mk)), 201


@matchmakers_bp.patch("/<int:id>")
@login_required
def update_matchmaker(id):
    mk = Matchmaker.query.get(id)
    if not mk:
        return jsonify({"error": "Matchmaker not found"}), 404

    for key, val in (request.json or {}).items():
        if hasattr(mk, key):
            setattr(mk, key, val)

    db.session.commit()
    return jsonify(matchmaker_schema.dump(mk)), 200


@matchmakers_bp.delete("/<int:id>")
@login_required
def delete_matchmaker(id):
    mk = Matchmaker.query.get(id)
    if not mk:
        return jsonify({"error": "Matchmaker not found"}), 404

    db.session.delete(mk)
    db.session.commit()
    return jsonify({"message": "Matchmaker deleted"}), 200
