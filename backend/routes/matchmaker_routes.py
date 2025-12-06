from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from extensions import db
from models import Matchmaker
from schemas import MatchmakerSchema

matchmakers_bp = Blueprint("matchmakers", __name__)

matchmaker_schema = MatchmakerSchema()
matchmaker_list_schema = MatchmakerSchema(many=True)


@matchmakers_bp.get("")
@login_required
def get_matchmakers():
    mks = Matchmaker.query.filter_by(user_id=current_user.id).all()
    return jsonify(matchmaker_list_schema.dump(mks)), 200


@matchmakers_bp.get("/<int:id>")
@login_required
def get_matchmaker(id):
    mk = Matchmaker.query.filter_by(id=id, user_id=current_user.id).first()
    if not mk:
        return jsonify({"error": "Matchmaker not found"}), 404
    return jsonify(matchmaker_schema.dump(mk)), 200


@matchmakers_bp.post("")
@login_required
def create_matchmaker():
    data = request.json or {}

    required = ["name", "location", "email_address", "phone_number", "salary"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    try:
        mk = Matchmaker(
            name=data["name"],
            location=data.get("location"),
            phone_number=data.get("phone_number"),
            email_address=data.get("email_address"),
            salary=float(data.get("salary")),
            user_id=current_user.id,
        )
        db.session.add(mk)
        db.session.commit()
    except ValueError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

    return jsonify(matchmaker_schema.dump(mk)), 201
