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
    matchmakers = Matchmaker.query.all()
    return jsonify(matchmaker_list_schema.dump(matchmakers)), 200


@matchmakers_bp.get("/<int:id>")
@login_required
def get_matchmaker(id):
    matchmaker = Matchmaker.query.get_or_404(id)
    return jsonify(matchmaker_schema.dump(matchmaker)), 200


@matchmakers_bp.post("")
@login_required
def create_matchmaker():
    data = request.json
    matchmaker = Matchmaker(**data)
    db.session.add(matchmaker)
    db.session.commit()
    return jsonify(matchmaker_schema.dump(matchmaker)), 201
