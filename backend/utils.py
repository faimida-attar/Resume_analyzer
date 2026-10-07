import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify, current_app
from models import User

def generate_jwt_token(user_id: str):
    """Generates a JWT token valid for 7 days."""
    now = datetime.now(timezone.utc)
    payload = {
        "user_id": user_id,
        "exp": now + timedelta(days=7),
        "iat": now
    }
    secret_key = current_app.config.get("JWT_SECRET_KEY", "dev-jwt-secret")
    return jwt.encode(payload, secret_key, algorithm="HS256")

def token_required(f):
    """Decorator to enforce valid JWT token in Authorization header."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization")
        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == "bearer":
                token = parts[1]

        if not token:
            return jsonify({"success": False, "message": "Authentication token missing."}), 401

        try:
            secret_key = current_app.config.get("JWT_SECRET_KEY", "dev-jwt-secret")
            data = jwt.decode(token, secret_key, algorithms=["HS256"])
            current_user = User.objects(id=data["user_id"]).first()
            if not current_user:
                return jsonify({"success": False, "message": "Invalid authentication user."}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "message": "Token expired. Please login again."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"success": False, "message": "Invalid authentication token."}), 401

        return f(current_user, *args, **kwargs)

    return decorated
