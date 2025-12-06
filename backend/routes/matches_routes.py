from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from extensions import db
from models import Match, Matchmaker, MaleSingle, FemaleSingle
from schemas import MatchSchema

matches_bp = Blueprint("matches", __name__)

match_schema = MatchSchema()
match_list_schema = MatchSchema(many=True)


@matches_bp.get("")
@login_required
def get_matches():
    matches = Match.query.filter_by(user_id=current_user.id).all()
    return jsonify(match_list_schema.dump(matches)), 200


@matches_bp.get("/<int:id>")
@login_required
def get_match(id):
    m = Match.query.filter_by(id=id, user_id=current_user.id).first()
    if not m:
        return jsonify({"error": "Match not found"}), 404
    return jsonify(match_schema.dump(m)), 200


@matches_bp.post("")
@login_required
def create_match():
    data = request.json or {}

    required = ["matchmaker_id", "male_single_id", "female_single_id", "status"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    # Ensure the related objects belong to this user
    mk = Matchmaker.query.filter_by(
        id=data["matchmaker_id"], user_id=current_user.id
    ).first()

    male = MaleSingle.query.filter_by(
        id=data["male_single_id"], user_id=current_user.id
    ).first()

    female = FemaleSingle.query.filter_by(
        id=data["female_single_id"], user_id=current_user.id
    ).first()

    if not mk:
        return jsonify({"error": "Matchmaker not found or not yours"}), 400
    if not male:
        return jsonify({"error": "Male single not found or not yours"}), 400
    if not female:
        return jsonify({"error": "Female single not found or not yours"}), 400

    try:
        m = Match(
            matchmaker_id=mk.id,
            male_single_id=male.id,
            female_single_id=female.id,
            status=data["status"],
            notes=data.get("notes"),
            user_id=current_user.id,
        )

        db.session.add(m)
        db.session.commit()

        return jsonify(match_schema.dump(m)), 201

    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@matches_bp.patch("/<int:id>")
@login_required
def update_match(id):
    m = Match.query.filter_by(id=id, user_id=current_user.id).first()
    if not m:
        return jsonify({"error": "Match not found"}), 404

    data = request.json or {}

    # Only allow status + notes to be updated (no changing who the singles are)
    for key in ["status", "notes"]:
        if key in data:
            setattr(m, key, data[key])

    try:
        db.session.commit()
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

    return jsonify(match_schema.dump(m)), 200


@matches_bp.delete("/<int:id>")
@login_required
def delete_match(id):
    m = Match.query.filter_by(id=id, user_id=current_user.id).first()
    if not m:
        return jsonify({"error": "Match not found"}), 404

    db.session.delete(m)
    db.session.commit()
    return jsonify({"message": "Match deleted"}), 200
