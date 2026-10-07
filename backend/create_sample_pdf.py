import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_sample_resume_pdf(filename="sample_resume.pdf"):
    """
    Generates a clean text-based sample PDF resume for testing using ReportLab.
    """
    output_path = os.path.join(os.path.dirname(__file__), filename)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor("#475569"),
        spaceAfter=12
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#0284c7"),
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceAfter=4
    )

    story = []

    # Title & Contact
    story.append(Paragraph("ALEX MORGAN", title_style))
    story.append(Paragraph("Email: alex.morgan@example.com | Phone: +1 (555) 019-2834 | Location: San Francisco, CA | LinkedIn: linkedin.com/in/alexmorgan-dev", subtitle_style))

    # Summary
    story.append(Paragraph("SUMMARY", section_heading))
    story.append(Paragraph("Computer Science graduate and Full-Stack Developer with 2+ years of experience building scalable web applications. Proficient in Python, SQL, React, Flask, Pandas, and NumPy. Passionate about machine learning, REST API development, and data visualization.", body_style))

    # Education
    story.append(Paragraph("EDUCATION", section_heading))
    story.append(Paragraph("<b>Bachelor of Science in Computer Science</b> — University of California (2020 – 2024)", body_style))
    story.append(Paragraph("Relevant Coursework: Data Structures & Algorithms, Database Systems, Machine Learning, Web Development.", body_style))

    # Skills
    story.append(Paragraph("SKILLS", section_heading))
    story.append(Paragraph("<b>Programming Languages:</b> Python, JavaScript, SQL, HTML5, CSS3, C++", body_style))
    story.append(Paragraph("<b>Frameworks & Libraries:</b> React, Flask, Node.js, Pandas, NumPy, Scikit-learn, Bootstrap", body_style))
    story.append(Paragraph("<b>Databases & Tools:</b> PostgreSQL, SQLite, Git, GitHub, REST APIs, Docker, VS Code", body_style))

    # Experience
    story.append(Paragraph("EXPERIENCE", section_heading))
    story.append(Paragraph("<b>Software Engineer Intern</b> — TechPulse Solutions (May 2023 – Dec 2023)", body_style))
    story.append(Paragraph("• Developed REST API endpoints using Python and Flask, reducing response times by 25%.", body_style))
    story.append(Paragraph("• Created interactive frontend dashboards with React and HTML5, serving 2,000+ monthly active users.", body_style))
    story.append(Paragraph("• Implemented PostgreSQL database schemas and optimized complex SQL queries.", body_style))

    # Projects
    story.append(Paragraph("PROJECTS", section_heading))
    story.append(Paragraph("<b>AI Resume Analyzer & Job Matcher</b> (Python, Flask, React, Scikit-Learn)", body_style))
    story.append(Paragraph("• Built an intelligent NLP resume parser using pdfplumber, TF-IDF vectorization, and Cosine Similarity.", body_style))
    story.append(Paragraph("• Implemented automated skill extraction across 8 technical categories and calculated ATS quality scores.", body_style))

    doc.build(story)
    print(f"Sample PDF created successfully at: {output_path}")
    return output_path

if __name__ == "__main__":
    generate_sample_resume_pdf()
