import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from services.resume_parser import extract_text_from_pdf

resume_bp = Blueprint("resume", __name__, url_prefix="/api")

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in current_app.config["ALLOWED_EXTENSIONS"]

@resume_bp.route("/upload-resume", methods=["POST"])
def upload_resume():
    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file part in request. Please upload a PDF resume."}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"success": False, "message": "No file selected."}), 400

    if not allowed_file(file.filename):
        return jsonify({"success": False, "message": "Invalid file format. Only PDF files (.pdf) are supported."}), 400

    filename = secure_filename(file.filename)
    upload_folder = current_app.config["UPLOAD_FOLDER"]
    os.makedirs(upload_folder, exist_ok=True)
    
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)

    try:
        extracted_text = extract_text_from_pdf(file_path)
        word_count = len(extracted_text.split())

        return jsonify({
            "success": True,
            "message": "Resume PDF parsed successfully!",
            "filename": filename,
            "extracted_text": extracted_text,
            "word_count": word_count
        }), 200
    except ValueError as ve:
        return jsonify({"success": False, "message": str(ve)}), 400
    except Exception as e:
        return jsonify({"success": False, "message": f"Error parsing PDF: {str(e)}"}), 500
    finally:
        # Clean up temporary uploaded file if desired or keep in uploads/
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass
