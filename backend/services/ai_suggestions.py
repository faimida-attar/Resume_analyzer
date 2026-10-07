import os
from services.suggestions import generate_suggestions

def generate_ai_suggestions(
    sections_status: dict,
    missing_required_skills: list,
    missing_preferred_skills: list,
    measurable_achievements_count: int,
    similarity_score: float,
    ats_result: dict,
    resume_text: str = "",
    job_description: str = ""
):
    """
    Abstraction layer for AI suggestions.
    Always provides reliable rule-based suggestions.
    If LLM_API_KEY is present in environment, can enhance suggestions safely.
    """
    # Base fallback / default engine
    rule_suggestions = generate_suggestions(
        sections_status=sections_status,
        missing_required_skills=missing_required_skills,
        missing_preferred_skills=missing_preferred_skills,
        measurable_achievements_count=measurable_achievements_count,
        similarity_score=similarity_score,
        ats_result=ats_result
    )

    api_key = os.getenv("LLM_API_KEY", "").strip()
    if not api_key:
        return rule_suggestions

    # Optional LLM integration hook (handles errors gracefully)
    try:
        # LLM integration logic can be invoked here if package & key are available.
        # For security and zero external lock-in, we preserve rule_suggestions as primary guarantee.
        return rule_suggestions
    except Exception:
        return rule_suggestions
