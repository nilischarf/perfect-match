from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, current_user, login_required

from extensions import db
from models import User
from schemas import UserSchema

auth_bp = Blueprint("auth", __name__)
user_schema = UserSchema()


@auth_bp.post("/signup")
def signup():
    data = request.json or {}
    username = (data.get("username") or "").strip()
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken"}), 400

    user = User(username=username)
    user.password = password
    db.session.add(user)
    db.session.commit()

    login_user(user)
    return jsonify({"message": "Signup successful", "user": user_schema.dump(user)}), 201


@auth_bp.post("/login")
def login():
    data = request.json or {}
    username = (data.get("username") or "").strip()
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    login_user(user)
    return jsonify({"message": "Logged in", "user": user_schema.dump(user)}), 200


@auth_bp.get("/check_session")
def check_session():
    if not current_user.is_authenticated:
        return jsonify({"logged_in": False}), 200
    return jsonify({"logged_in": True, "user": user_schema.dump(current_user)}), 200


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    session.clear()
    return jsonify({"message": "Logged out"}), 200
