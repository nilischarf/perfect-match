from flask import Blueprint, request, jsonify
from flask_login import login_required
from extensions import db
from models import FemaleSingle
from schemas import FemaleSingleSchema

female_singles_bp = Blueprint("female_singles", __name__)
female_schema = FemaleSingleSchema()
female_list_schema = FemaleSingleSchema(many=True)


@female_singles_bp.get("/")
@login_required
def get_female_singles():
    females = FemaleSingle.query.all()
    return jsonify(female_list_schema.dump(females)), 200


@female_singles_bp.get("/<int:id>")
@login_required
def get_female_single(id):
    female = FemaleSingle.query.get_or_404(id)
    return jsonify(female_schema.dump(female)), 200


@female_singles_bp.post("/")
@login_required
def create_female_single():
    data = request.json
    female = FemaleSingle(**data)
    db.session.add(female)
    db.session.commit()
    return jsonify(female_schema.dump(female)), 201
