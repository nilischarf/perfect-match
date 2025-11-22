from flask import Blueprint, request
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
    return female_list_schema.jsonify(FemaleSingle.query.all())


@female_singles_bp.get("/<int:id>")
@login_required
def get_female_single(id):
    female = FemaleSingle.query.get_or_404(id)
    return female_schema.jsonify(female)


@female_singles_bp.post("/")
@login_required
def create_female_single():
    data = request.json
    female = FemaleSingle(**data)
    db.session.add(female)
    db.session.commit()
    return female_schema.jsonify(female), 201
