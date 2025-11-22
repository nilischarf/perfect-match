from flask import Blueprint, request, jsonify
from flask_login import login_required
from extensions import db
from models import Match
from schemas import MatchSchema

matches_bp = Blueprint(
    "matches",
    __name__,
    url_prefix="/matches"
)

match_schema = MatchSchema()
match_list_schema = MatchSchema(many=True)


@matches_bp.get("")  
@login_required
def get_matches():
    matches = Match.query.all()
    return jsonify(match_list_schema.dump(matches)), 200


@matches_bp.get("/<int:id>")
@login_required
def get_match(id):
    match = Match.query.get_or_404(id)
    return jsonify(match_schema.dump(match)), 200


@matches_bp.post("")   
@login_required
def create_match():
    data = request.json
    match = Match(**data)
    db.session.add(match)
    db.session.commit()
    return jsonify(match_schema.dump(match)), 201


@matches_bp.patch("/<int:id>")
@login_required
def update_match(id):
    match = Match.query.get_or_404(id)
    data = request.json

    for key, value in data.items():
        setattr(match, key, value)

    db.session.commit()
    return jsonify(match_schema.dump(match)), 200
