import os
import sys
import pytest

# Add parent backend directory to sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app
from database import db
from models import User, ResumeAnalysis
from services.resume_parser import extract_text_from_pdf
from services.nlp_processor import clean_text, preprocess_for_tfidf
from services.skill_extractor import extract_skills_from_text
from services.matcher import calculate_tfidf_similarity, match_resume_and_job
from services.resume_scorer import calculate_resume_quality_score, analyze_resume_sections
from services.ats_checker import evaluate_ats_readiness

@pytest.fixture
def client():
    test_config = {
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "WTF_CSRF_ENABLED": False
    }
    app = create_app(test_config=test_config)
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

def test_nlp_processor_preserves_tech_terms():
    raw_text = "I am skilled in C++, C#, .NET, Node.js, React, SQL, and AWS."
    cleaned = clean_text(raw_text)
    assert "c++" in cleaned
    assert "c#" in cleaned
    assert ".net" in cleaned
    assert "node.js" in cleaned

def test_skill_extraction():
    text = "Experience with Python, SQL, React, HTML5, CSS3, Flask, and AWS cloud."
    skills = extract_skills_from_text(text)
    assert "Python" in skills
    assert "SQL" in skills
    assert "React" in skills
    assert "Flask" in skills
    assert "AWS" in skills

def test_tfidf_matcher():
    resume = "Python developer with experience in Flask, SQL, Pandas, and REST APIs."
    job = "Looking for a Python Developer skilled in Python, Flask, SQL, and REST APIs."
    
    similarity = calculate_tfidf_similarity(resume, job)
    assert similarity > 30.0  # Should be highly similar
    
    match_data = match_resume_and_job(resume, job)
    assert "Python" in match_data["matched_skills"]
    assert "Flask" in match_data["matched_skills"]
    assert match_data["skill_match_score"] >= 50.0

def test_resume_scorer_and_sections():
    resume = """
    Alex Morgan
    Email: alex@example.com | Phone: 1234567890
    
    SUMMARY
    Experienced Software Engineer.
    
    EDUCATION
    BS in Computer Science.
    
    SKILLS
    Python, SQL, React, Docker.
    
    EXPERIENCE
    Software Developer - Built REST APIs, reduced latency by 30%.
    
    PROJECTS
    AI Resume Analyzer.
    """
    quality = calculate_resume_quality_score(resume, ["Python", "SQL", "React", "Docker"])
    assert quality["overall_quality_score"] >= 65.0
    assert quality["sections"]["Education"] == "Present"
    assert quality["sections"]["Skills"] == "Present"

def test_pdf_parsing():
    sample_pdf_path = os.path.join(backend_dir, "sample_resume.pdf")
    if os.path.exists(sample_pdf_path):
        text = extract_text_from_pdf(sample_pdf_path)
        assert "ALEX MORGAN" in text
        assert "SKILLS" in text

def test_auth_and_analysis_routes(client):
    # 1. Register User
    reg_res = client.post("/api/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "password123",
        "confirm_password": "password123"
    })
    assert reg_res.status_code == 201
    token = reg_res.get_json()["token"]

    # 2. Login User
    login_res = client.post("/api/login", json={
        "email": "test@example.com",
        "password": "password123"
    })
    assert login_res.status_code == 200
    assert "token" in login_res.get_json()

    # 3. Analyze Resume
    headers = {"Authorization": f"Bearer {token}"}
    analyze_res = client.post("/api/analyze", headers=headers, json={
        "resume_text": "Computer Science graduate with experience in Python, SQL, React, HTML, CSS, Pandas and NumPy. Developed web applications using Flask and React.",
        "job_description": "Python Developer with experience in Python, Flask, SQL, Pandas, NumPy, REST APIs and Machine Learning.",
        "resume_filename": "test_resume.pdf"
    })
    assert analyze_res.status_code == 201
    data = analyze_res.get_json()["data"]
    assert data["similarity_score"] > 0
    assert "Python" in data["matched_skills"]
    assert "Machine Learning" in data["missing_skills"]

    # 4. Check History & Stats
    hist_res = client.get("/api/analysis/history", headers=headers)
    assert hist_res.status_code == 200
    assert len(hist_res.get_json()["history"]) == 1

    stats_res = client.get("/api/dashboard/stats", headers=headers)
    assert stats_res.status_code == 200
    assert stats_res.get_json()["stats"]["total_analyses"] == 1
