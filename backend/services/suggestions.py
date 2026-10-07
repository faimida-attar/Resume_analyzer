def generate_suggestions(
    sections_status: dict,
    missing_required_skills: list,
    missing_preferred_skills: list,
    measurable_achievements_count: int,
    similarity_score: float,
    ats_result: dict
):
    """
    Generates rule-based, ethical resume improvement suggestions.
    """
    suggestions = []

    # 1. Section suggestions
    if sections_status.get("Skills") == "Missing":
        suggestions.append({
            "category": "Structure",
            "type": "High Priority",
            "message": "Add a dedicated 'Skills' section listing your technical proficiencies, tools, and frameworks."
        })
    if sections_status.get("Projects") == "Missing":
        suggestions.append({
            "category": "Structure",
            "type": "Medium Priority",
            "message": "Consider adding 2–3 relevant technical projects with GitHub links to showcase practical implementation."
        })
    if sections_status.get("Experience") == "Missing":
        suggestions.append({
            "category": "Structure",
            "type": "High Priority",
            "message": "Include an 'Experience' or 'Work History' section, or detail academic/internship experience clearly."
        })

    # 2. Skill & Keyword suggestions
    if missing_required_skills:
        top_missing = missing_required_skills[:5]
        skills_str = ", ".join(top_missing)
        suggestions.append({
            "category": "Skills & Keywords",
            "type": "High Priority",
            "message": f"Required skills missing from resume: {skills_str}. If you have experience with these tools, highlight them in your project or work descriptions."
        })

    if missing_preferred_skills:
        top_pref = missing_preferred_skills[:4]
        pref_str = ", ".join(top_pref)
        suggestions.append({
            "category": "Skills & Keywords",
            "type": "Low Priority",
            "message": f"Preferred bonus skills missing: {pref_str}. Mentioning these if genuine can help differentiate your application."
        })

    # 3. Measurable achievements suggestion
    if measurable_achievements_count < 2:
        suggestions.append({
            "category": "Impact & Metrics",
            "type": "High Priority",
            "message": "Quantify your achievements using metrics (e.g. 'Reduced latency by 30%', 'Served 5,000+ active users', 'Improved query performance by 40%')."
        })

    # 4. Keyword relevance suggestion
    if similarity_score < 60.0:
        suggestions.append({
            "category": "Relevance",
            "type": "Medium Priority",
            "message": "Tailor your project bullet points to naturally incorporate relevant vocabulary and domain terms from the job description."
        })

    # 5. ATS formatting suggestion
    ats_fails = [c for c in ats_result.get("checks", []) if c["status"] == "FAIL"]
    for fail in ats_fails:
        suggestions.append({
            "category": "ATS Optimization",
            "type": "High Priority",
            "message": f"ATS Warning ({fail['title']}): {fail['details']}"
        })

    if not suggestions:
        suggestions.append({
            "category": "Overall Quality",
            "type": "Info",
            "message": "Great job! Your resume aligns well with standard structure and key job requirements."
        })

    return suggestions
