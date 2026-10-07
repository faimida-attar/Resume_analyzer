import re

COMMON_SECTIONS = {
    "Contact Information": [r"\bemail\b", r"\bphone\b", r"\bmobile\b", r"\blinkedin\b", r"\bgithub\b", r"\baddress\b"],
    "Summary / Objective": [r"\bsummary\b", r"\bprofile\b", r"\bobjective\b", r"\babout me\b"],
    "Education": [r"\beducation\b", r"\bacademics?\b", r"\bdegree\b", r"\buniversity\b", r"\bcollege\b", r"\bbachelor\b", r"\bmaster\b"],
    "Skills": [r"\bskills?\b", r"\btechnologies\b", r"\btechnical skills\b", r"\bproficiencies\b"],
    "Experience": [r"\bexperience\b", r"\bwork history\b", r"\bemployment\b", r"\binternship\b", r"\bjob history\b"],
    "Projects": [r"\bprojects?\b", r"\bpersonal projects\b", r"\bacademic projects\b"],
    "Certifications": [r"\bcertificat(?:e|ions?)\b", r"\blicenses?\b", r"\baccreditation\b"],
    "Achievements": [r"\bachievements?\b", r"\bawards?\b", r"\bhonors?\b", r"\baccomplishments?\b"]
}

def analyze_resume_sections(text: str):
    """
    Detects key resume sections and calculates presence boolean dictionary.
    """
    text_lower = text.lower()
    section_status = {}

    for section, patterns in COMMON_SECTIONS.items():
        present = any(re.search(pat, text_lower) for pat in patterns)
        section_status[section] = "Present" if present else "Missing"

    return section_status

def check_measurable_achievements(text: str):
    """
    Scans for quantitative metrics (numbers, percentages, dollar amounts, metrics).
    """
    patterns = [
        r"\b\d+%\b",                  # percentages e.g. 50%
        r"\$\d+",                      # dollar amounts e.g. $10k
        r"\b\d+\s+(?:users|customers|clients|requests|seconds|ms|percent|hrs|hours|days)\b",
        r"\b(?:reduced|increased|improved|boosted|grew|saved|optimized)\b.*?\b\d+"
    ]
    matches = 0
    text_lower = text.lower()
    for pat in patterns:
        matches += len(re.findall(pat, text_lower))
    return matches

def calculate_resume_quality_score(resume_text: str, detected_skills: list):
    """
    Calculates Resume Quality Score (0 - 100) and detailed breakdown.
    """
    sections = analyze_resume_sections(resume_text)
    
    # 1. Section presence score (Max 40 pts)
    section_weights = {
        "Contact Information": 6,
        "Summary / Objective": 5,
        "Education": 8,
        "Skills": 10,
        "Experience": 11,
        "Projects": 8,
        "Certifications": 2
    }
    sections_score = sum(weight for sec, weight in section_weights.items() if sections.get(sec) == "Present")

    # 2. Skill count score (Max 25 pts)
    skill_count = len(detected_skills)
    skills_score = min(25, skill_count * 5)

    # 3. Measurable achievements score (Max 20 pts)
    achievements_count = check_measurable_achievements(resume_text)
    achievements_score = min(20, achievements_count * 5)

    # 4. Length & Readability score (Max 20 pts)
    words_count = len(resume_text.split())
    if 250 <= words_count <= 1000:
        readability_score = 20
    elif 150 <= words_count < 250 or 1000 < words_count <= 1500:
        readability_score = 14
    else:
        readability_score = 8

    total_score = min(100.0, round(sections_score + skills_score + achievements_score + readability_score, 1))

    return {
        "overall_quality_score": total_score,
        "breakdown": {
            "sections_score": round((sections_score / 35.0) * 100, 1),
            "skills_score": round((skills_score / 25.0) * 100, 1),
            "achievements_score": round((achievements_score / 20.0) * 100, 1),
            "readability_score": round((readability_score / 20.0) * 100, 1)
        },
        "sections": sections,
        "measurable_achievements_count": achievements_count,
        "word_count": words_count
    }
