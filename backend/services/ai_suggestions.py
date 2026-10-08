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
        from google import genai
        client = genai.Client(api_key=api_key)
        
        prompt = f"""
        You are an expert ATS (Applicant Tracking System) resume reviewer and technical recruiter. 
        Please review the following resume text against the job description and give exactly 3 concise, highly actionable bullet points on how the candidate can improve their resume specifically for this role.
        
        Job Description: {job_description}
        
        Resume: {resume_text}
        """
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        
        llm_feedback = response.text.strip()
        
        # Append the AI feedback to our rule-based suggestions
        if llm_feedback:
            rule_suggestions.insert(0, f"🤖 **AI Review:**\n{llm_feedback}")
            
        return rule_suggestions
    except Exception as e:
        print(f"LLM Error: {e}")
        return rule_suggestions
