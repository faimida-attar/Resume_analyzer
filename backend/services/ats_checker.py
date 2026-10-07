import re

def evaluate_ats_readiness(resume_text: str, sections_status: dict):
    """
    Evaluates ATS compatibility based on standard headings, contact details,
    text length, and formatting signals.
    """
    checks = []
    text_lower = resume_text.lower()

    # Check 1: Standard Headings
    critical_sections = ["Education", "Skills", "Experience"]
    missing_critical = [sec for sec in critical_sections if sections_status.get(sec) != "Present"]
    
    if not missing_critical:
        checks.append({
            "title": "Standard Headings",
            "status": "PASS",
            "details": "Resume includes essential standard ATS section headings (Education, Skills, Experience)."
        })
    else:
        checks.append({
            "title": "Standard Headings",
            "status": "FAIL",
            "details": f"Missing critical standard headings: {', '.join(missing_critical)}."
        })

    # Check 2: Contact Information
    email_present = bool(re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text_lower))
    phone_present = bool(re.search(r"\b\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b", text_lower))

    if email_present and phone_present:
        checks.append({
            "title": "Contact Details",
            "status": "PASS",
            "details": "Email address and phone number detected clearly."
        })
    elif email_present or phone_present:
        checks.append({
            "title": "Contact Details",
            "status": "WARNING",
            "details": "Only one contact method (email or phone) detected."
        })
    else:
        checks.append({
            "title": "Contact Details",
            "status": "FAIL",
            "details": "No clear email or phone number found in extractable text."
        })

    # Check 3: Text-based Format & Readability
    word_count = len(resume_text.split())
    if word_count > 150:
        checks.append({
            "title": "Text Parseability",
            "status": "PASS",
            "details": f"PDF is text-searchable with {word_count} extractable words."
        })
    else:
        checks.append({
            "title": "Text Parseability",
            "status": "WARNING",
            "details": "Resume text is quite brief. Ensure PDF is not composed mostly of scanned images."
        })

    # Check 4: Special Characters & Complex Tables signal
    special_char_ratio = len(re.findall(r"[^\w\s\.,-]", resume_text)) / max(1, len(resume_text))
    if special_char_ratio < 0.08:
        checks.append({
            "title": "Formatting Simplicity",
            "status": "PASS",
            "details": "Clean typography without excessive special symbols or complex nested tables."
        })
    else:
        checks.append({
            "title": "Formatting Simplicity",
            "status": "WARNING",
            "details": "High concentration of non-standard symbols detected. Simple clean layouts parse best in ATS."
        })

    # Overall ATS Status calculation
    fails = sum(1 for c in checks if c["status"] == "FAIL")
    warnings = sum(1 for c in checks if c["status"] == "WARNING")

    if fails == 0 and warnings <= 1:
        overall_status = "Good"
    elif fails == 0:
        overall_status = "Needs Minor Review"
    else:
        overall_status = "Needs Improvement"

    return {
        "overall_ats_status": overall_status,
        "checks": checks,
        "disclaimer": "This is an automated structural check based on standard ATS parsing heuristics, not a proprietary vendor guarantee."
    }
