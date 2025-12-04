from flask import Blueprint, request, jsonify
from flask_login import login_required
from extensions import db
from models import Match
from schemas import MatchSchema

matches_bp = Blueprint("matches", __name__, url_prefix="/matches")
match_schema = MatchSchema()
match_list_schema = MatchSchema(many=True)


@matches_bp.get("")
@login_required
def get_matches():
    return jsonify(match_list_schema.dump(Match.query.all())), 200


@matches_bp.get("/<int:id>")
@login_required
def get_match(id):
    m = Match.query.get(id)
    if not m:
        return jsonify({"error": "Match not found"}), 404
    return jsonify(match_schema.dump(m)), 200


@matches_bp.post("")
@login_required
def create_match():
    data = request.json or {}

    if not data.get("matchmaker_id"):
        return jsonify({"error": "Matchmaker ID required"}), 400
    if not data.get("male_single_id") and not data.get("female_single_id"):
        return jsonify({"error": "Must include male_single_id or female_single_id"}), 400

    m = Match(**data)
    db.session.add(m)
    db.session.commit()
    return jsonify(match_schema.dump(m)), 201


@matches_bp.patch("/<int:id>")
@login_required
def update_match(id):
    match = Match.query.get_or_404(id)
    data = request.json or {}

    # Allowed fields to update
    allowed_fields = {"status", "male_id", "female_id", "notes"}

    for key, value in data.items():
        if key not in allowed_fields:
            return jsonify({"error": f"Field '{key}' cannot be updated"}), 400
        setattr(match, key, value)

    db.session.commit()
    return jsonify(match_schema.dump(match)), 200


@matches_bp.delete("/<int:id>")
@login_required
def delete_match(id):
    m = Match.query.get(id)
    if not m:
        return jsonify({"error": "Match not found"}), 404

    db.session.delete(m)
    db.session.commit()
    return jsonify({"message": "Match deleted"}), 200
