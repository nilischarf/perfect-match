from flask import Blueprint, request, jsonify
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
    males = MaleSingle.query.all()
    return jsonify(male_list_schema.dump(males)), 200


@male_singles_bp.get("/<int:id>")
@login_required
def get_male_single(id):
    male = MaleSingle.query.get_or_404(id)
    return jsonify(male_schema.dump(male)), 200


@male_singles_bp.post("/")
@login_required
def create_male_single():
    data = request.json
    male = MaleSingle(**data)
    db.session.add(male)
    db.session.commit()
    return jsonify(male_schema.dump(male)), 201
