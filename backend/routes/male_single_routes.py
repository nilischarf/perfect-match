from flask import Blueprint, request
from flask_login import login_required
from extensions import db
from models import MaleSingle
from schemas import MaleSingleSchema

male_singles_bp = Blueprint("male_singles", __name__)
male_schema = MaleSingleSchema()
male_list_schema = MaleSingleSchema(many=True)


@male_singles_bp.get("/")
@login_required
def get_all_male_singles():
    return male_list_schema.jsonify(MaleSingle.query.all())


@male_singles_bp.get("/<int:id>")
@login_required
def get_male_single(id):
    male = MaleSingle.query.get_or_404(id)
    return male_schema.jsonify(male)


@male_singles_bp.post("/")
@login_required
def create_male_single():
    data = request.json
    male = MaleSingle(**data)
    db.session.add(male)
    db.session.commit()
    return male_schema.jsonify(male), 201
