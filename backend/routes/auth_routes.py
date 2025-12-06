from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user

from extensions import db
from models import User
from schemas import UserSchema

auth_bp = Blueprint("auth", __name__)
user_schema = UserSchema()


@auth_bp.post("/signup")
def signup():
    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    # --- Validations ---
    if not username or not password:
        return {"error": "Username and password are required."}, 400

    if len(username) < 3:
        return {"error": "Username must be at least 3 characters."}, 400

    if len(password) < 6:
        return {"error": "Password must be at least 6 characters."}, 400

    # Prevent duplicate usernames
    if User.query.filter_by(username=username).first():
        return {"error": "Username already taken."}, 400

    # Create user (password hashing already handled by setter)
    user = User(username=username)
    user.password = password  

    db.session.add(user)
    db.session.commit()

    # Auto-login user (optional — can remove)
    login_user(user)

    return {
        "message": "Signup successful",
        "user": {"id": user.id, "username": user.username},
        "logged_in": True
    }, 201


@auth_bp.post("/login")
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    login_user(user)

    return jsonify({
        "message": "Login successful",
        "user": user_schema.dump(user)
    }), 200


@auth_bp.route("/check_session", methods=["GET"])
def check_session():
    if current_user.is_authenticated:
        return jsonify({
            "logged_in": True,
            "user": user_schema.dump(current_user)
        }), 200

    return jsonify({
        "logged_in": False
    }), 200
    

@auth_bp.get("/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"})
