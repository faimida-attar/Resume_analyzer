from flask import Blueprint, request, jsonify
from models import User
from utils import generate_jwt_token, token_required
import re

auth_bp = Blueprint("auth", __name__, url_prefix="/api")

def is_valid_email(email):
    pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    return bool(re.match(pattern, email))

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    confirm_password = data.get("confirm_password", "")

    if not name or not email or not password:
        return jsonify({"success": False, "message": "All fields (Name, Email, Password) are required."}), 400

    if not is_valid_email(email):
        return jsonify({"success": False, "message": "Please enter a valid email address."}), 400

    if len(password) < 6:
        return jsonify({"success": False, "message": "Password must be at least 6 characters long."}), 400

    if confirm_password and password != confirm_password:
        return jsonify({"success": False, "message": "Passwords do not match."}), 400

    existing_user = User.objects(email=email).first()
    if existing_user:
        return jsonify({"success": False, "message": "An account with this email already exists."}), 400

    user = User(name=name, email=email)
    user.set_password(password)
    user.save()

    token = generate_jwt_token(str(user.id))
    return jsonify({
        "success": True,
        "message": "Registration successful!",
        "token": token,
        "user": user.to_dict()
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required."}), 400

    user = User.objects(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"success": False, "message": "Invalid email or password."}), 401

    token = generate_jwt_token(str(user.id))
    return jsonify({
        "success": True,
        "message": "Login successful!",
        "token": token,
        "user": user.to_dict()
    }), 200

@auth_bp.route("/me", methods=["GET"])
@token_required
def get_current_user(current_user):
    return jsonify({
        "success": True,
        "user": current_user.to_dict()
    }), 200

@auth_bp.route("/logout", methods=["POST"])
def logout():
    return jsonify({"success": True, "message": "Logged out successfully."}), 200
