from flask import Blueprint, request, jsonify
from models import ResumeAnalysis
from utils import token_required
from services.matcher import match_resume_and_job
from services.resume_scorer import calculate_resume_quality_score, analyze_resume_sections
from services.ats_checker import evaluate_ats_readiness
from services.ai_suggestions import generate_ai_suggestions
from services.skill_extractor import extract_skills_from_text

analysis_bp = Blueprint("analysis", __name__, url_prefix="/api")

@analysis_bp.route("/analyze", methods=["POST"])
@token_required
def analyze_resume(current_user):
    data = request.get_json() or {}
    resume_text = data.get("resume_text", "").strip()
    job_description = data.get("job_description", "").strip()
    resume_filename = data.get("resume_filename", "resume.pdf").strip()

    if not resume_text:
        return jsonify({"success": False, "message": "Resume text is required for analysis."}), 400

    if not job_description:
        return jsonify({"success": False, "message": "Please enter a job description."}), 400

    # 1. Matching engine (TF-IDF, Cosine Similarity, Skill Comparison)
    match_result = match_resume_and_job(resume_text, job_description)

    # 2. Extract detected skills
    resume_skills = extract_skills_from_text(resume_text)

    # 3. Resume Quality Score & Sections
    quality_result = calculate_resume_quality_score(resume_text, resume_skills)

    # 4. ATS Readiness Check
    ats_result = evaluate_ats_readiness(resume_text, quality_result["sections"])

    # 5. Generate Suggestions
    suggestions = generate_ai_suggestions(
        sections_status=quality_result["sections"],
        missing_required_skills=match_result["required_missing_skills"],
        missing_preferred_skills=match_result["preferred_missing_skills"],
        measurable_achievements_count=quality_result["measurable_achievements_count"],
        similarity_score=match_result["similarity_score"],
        ats_result=ats_result,
        resume_text=resume_text,
        job_description=job_description
    )

    # 6. Save Analysis to Database
    analysis_record = ResumeAnalysis(
        user_id=current_user.id,
        resume_filename=resume_filename,
        resume_text=resume_text,
        job_description=job_description,
        similarity_score=match_result["similarity_score"],
        skill_match_score=match_result["skill_match_score"],
        resume_quality_score=quality_result["overall_quality_score"],
        matched_skills=match_result["matched_skills"],
        missing_skills=match_result["missing_skills"],
        required_missing_skills=match_result["required_missing_skills"],
        preferred_missing_skills=match_result["preferred_missing_skills"],
        section_analysis={
            "sections": quality_result["sections"],
            "breakdown": quality_result["breakdown"],
            "word_count": quality_result["word_count"]
        },
        ats_result=ats_result,
        suggestions=suggestions
    )

    analysis_record.save()

    return jsonify({
        "success": True,
        "message": "Analysis completed successfully!",
        "analysis_id": str(analysis_record.id),
        "data": analysis_record.to_dict()
    }), 201

@analysis_bp.route("/analysis/history", methods=["GET"])
@token_required
def get_analysis_history(current_user):
    records = ResumeAnalysis.objects(user_id=current_user.id).order_by("-created_at")
    return jsonify({
        "success": True,
        "history": [r.to_dict() for r in records]
    }), 200

@analysis_bp.route("/analysis/<string:analysis_id>", methods=["GET"])
@token_required
def get_analysis_detail(current_user, analysis_id):
    record = ResumeAnalysis.objects(id=analysis_id, user_id=current_user.id).first()
    if not record:
        return jsonify({"success": False, "message": "Analysis record not found."}), 404

    return jsonify({
        "success": True,
        "data": record.to_dict()
    }), 200

@analysis_bp.route("/analysis/<string:analysis_id>", methods=["DELETE"])
@token_required
def delete_analysis(current_user, analysis_id):
    record = ResumeAnalysis.objects(id=analysis_id, user_id=current_user.id).first()
    if not record:
        return jsonify({"success": False, "message": "Analysis record not found."}), 404

    record.delete()

    return jsonify({"success": True, "message": "Analysis deleted successfully."}), 200

@analysis_bp.route("/dashboard/stats", methods=["GET"])
@token_required
def get_dashboard_stats(current_user):
    records = ResumeAnalysis.objects(user_id=current_user.id)
    total_count = records.count()

    if total_count == 0:
        return jsonify({
            "success": True,
            "stats": {
                "total_analyses": 0,
                "avg_similarity_score": 0.0,
                "avg_skill_match": 0.0,
                "avg_quality_score": 0.0,
                "recent_analyses": []
            }
        }), 200

    avg_sim = sum(r.similarity_score for r in records) / total_count
    avg_skill = sum(r.skill_match_score for r in records) / total_count
    avg_qual = sum(r.resume_quality_score for r in records) / total_count

    recent = ResumeAnalysis.objects(user_id=current_user.id).order_by("-created_at")[:5]

    return jsonify({
        "success": True,
        "stats": {
            "total_analyses": total_count,
            "avg_similarity_score": round(avg_sim, 1),
            "avg_skill_match": round(avg_skill, 1),
            "avg_quality_score": round(avg_qual, 1),
            "recent_analyses": [r.to_dict() for r in recent]
        }
    }), 200
