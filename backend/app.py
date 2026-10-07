import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import init_db
from routes.auth_routes import auth_bp
from routes.resume_routes import resume_bp
from routes.analysis_routes import analysis_bp

def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(Config)

    if test_config:
        app.config.update(test_config)

    # Enable CORS for React frontend (localhost:5173 / localhost:3000 / all origins in dev)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize Database
    init_db(app)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(analysis_bp)

    @app.route("/")
    def index():
        return jsonify({
            "status": "online",
            "name": "AI Resume Analyzer & Job Matcher API",
            "version": "1.0.0"
        })

    # Error Handlers
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "message": "Endpoint not found."}), 404

    @app.errorhandler(413)
    def request_entity_too_large(e):
        return jsonify({"success": False, "message": "Uploaded file is too large. Maximum size is 16MB."}), 413

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"success": False, "message": "Internal server error occurred."}), 500

    # Ensure upload folder exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    with app.app_context():
        pass

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
