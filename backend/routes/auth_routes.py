from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user

from extensions import db
from models import User
from schemas import UserSchema

auth_bp = Blueprint("auth", __name__)
user_schema = UserSchema()


@auth_bp.post("/signup")
def signup():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    user = User(username=username)
    user.password = password
    db.session.add(user)
    db.session.commit()

    return user_schema.jsonify(user)


@auth_bp.post("/login")
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    login_user(user)
    return user_schema.jsonify(user)


@auth_bp.get("/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"})
