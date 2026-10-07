import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from services.nlp_processor import preprocess_for_tfidf
from services.skill_extractor import extract_skills_from_text, normalize_skill_name

def calculate_tfidf_similarity(resume_text: str, job_description: str) -> float:
    """
    Computes Cosine Similarity between TF-IDF vectors of resume and job description.
    Returns percentage score between 0.0 and 100.0.
    """
    processed_resume = preprocess_for_tfidf(resume_text)
    processed_job = preprocess_for_tfidf(job_description)

    if not processed_resume or not processed_job:
        return 0.0

    vectorizer = TfidfVectorizer(ngram_range=(1, 2))
    try:
        tfidf_matrix = vectorizer.fit_transform([processed_resume, processed_job])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        score = float(similarity) * 100.0
        return max(0.0, min(100.0, round(score, 1)))
    except Exception:
        return 0.0

def classify_required_vs_preferred_skills(job_description: str, missing_skills: list):
    """
    Categorizes missing job skills into Required vs Preferred based on contextual keywords.
    """
    required_missing = []
    preferred_missing = []

    jd_lines = job_description.lower().split("\n")

    # Keyword patterns for context matching
    required_patterns = [r"\brequired\b", r"\bmust have\b", r"\bmandatory\b", r"\bminimum qualifications?\b", r"\bkey requirements?\b", r"\bessential\b"]
    preferred_patterns = [r"\bpreferred\b", r"\bnice to have\b", r"\bbonus\b", r"\bplus\b", r"\bgood to have\b", r"\bdesirable\b"]

    for skill in missing_skills:
        skill_lower = skill.lower()
        is_classified = False

        for line in jd_lines:
            if skill_lower in line:
                if any(re.search(p, line) for p in required_patterns):
                    required_missing.append(skill)
                    is_classified = True
                    break
                elif any(re.search(p, line) for p in preferred_patterns):
                    preferred_missing.append(skill)
                    is_classified = True
                    break

        if not is_classified:
            # Default unclassified missing skills to required
            required_missing.append(skill)

    return sorted(list(set(required_missing))), sorted(list(set(preferred_missing)))

def match_resume_and_job(resume_text: str, job_description: str):
    """
    Main matching engine function:
    1. Computes TF-IDF Cosine Similarity score.
    2. Extracts resume skills & job skills.
    3. Computes matched skills, missing skills, required vs preferred missing skills.
    4. Computes separate Skill Match Score.
    """
    # 1. TF-IDF Similarity
    similarity_score = calculate_tfidf_similarity(resume_text, job_description)

    # 2. Extract Skills
    resume_skills = set(extract_skills_from_text(resume_text))
    job_skills = set(extract_skills_from_text(job_description))

    matched_skills = sorted(list(resume_skills.intersection(job_skills)))
    missing_skills = sorted(list(job_skills.difference(resume_skills)))

    # 3. Calculate Skill Match Score
    if len(job_skills) > 0:
        skill_match_score = round((len(matched_skills) / len(job_skills)) * 100.0, 1)
    else:
        skill_match_score = 100.0 if len(resume_skills) > 0 else 0.0

    # 4. Required vs Preferred Missing Skills Classification
    required_missing, preferred_missing = classify_required_vs_preferred_skills(
        job_description, missing_skills
    )

    return {
        "similarity_score": similarity_score,
        "skill_match_score": skill_match_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "required_missing_skills": required_missing,
        "preferred_missing_skills": preferred_missing,
        "total_job_skills_count": len(job_skills),
        "matched_count": len(matched_skills)
    }
