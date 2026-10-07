import re

# Comprehensive Categorized Technical Skill Database
SKILLS_DATABASE = {
    "Programming Languages": [
        "python", "java", "javascript", "typescript", "c", "c++", "c#", "php",
        "go", "golang", "ruby", "kotlin", "swift", "rust", "scala", "r", "perl", "dart", "shell", "bash"
    ],
    "Web": [
        "html", "html5", "css", "css3", "javascript", "typescript", "react", "react.js",
        "angular", "vue", "vue.js", "next.js", "nuxt.js", "bootstrap", "tailwind",
        "tailwind css", "jquery", "sass", "less", "redux", "webpack", "vite"
    ],
    "Backend": [
        "flask", "django", "fastapi", "node.js", "express", "express.js", "spring",
        "spring boot", "asp.net", ".net", "laravel", "nest.js", "graphql", "rest api",
        "restful api", "microservices", "gRPC"
    ],
    "Databases": [
        "mysql", "postgresql", "postgres", "mongodb", "sqlite", "oracle", "redis",
        "elasticsearch", "cassandra", "dynamodb", "mariadb", "firebase", "supabase", "neo4j"
    ],
    "Data Science": [
        "pandas", "numpy", "matplotlib", "seaborn", "scikit-learn", "sklearn",
        "scipy", "statsmodels", "data analysis", "exploratory data analysis", "eda",
        "feature engineering", "data visualization"
    ],
    "AI / ML": [
        "machine learning", "deep learning", "nlp", "natural language processing",
        "tensorflow", "keras", "pytorch", "opencv", "computer vision", "transformers",
        "bert", "llm", "large language models", "prompt engineering", "langchain",
        "spacy", "nltk", "huggingface", "tf-idf", "cosine similarity"
    ],
    "Cloud / DevOps": [
        "aws", "amazon web services", "azure", "gcp", "google cloud", "docker",
        "kubernetes", "git", "github", "gitlab", "ci/cd", "terraform", "ansible",
        "jenkins", "linux", "unix", "bash", "nginx", "apache"
    ],
    "Data / BI": [
        "power bi", "tableau", "excel", "advanced excel", "sql", "pl/sql", "snowflake",
        "bigquery", "databricks", "etl", "data warehousing", "looker"
    ]
}

# Alias / Normalization map for canonical skill display names
CANONICAL_SKILL_NAMES = {
    "cpp": "C++",
    "c++": "C++",
    "c#": "C#",
    "csharp": "C#",
    ".net": ".NET",
    "dotnet": ".NET",
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "express.js": "Express.js",
    "express": "Express.js",
    "react.js": "React",
    "react": "React",
    "vue.js": "Vue.js",
    "vue": "Vue.js",
    "next.js": "Next.js",
    "html5": "HTML5",
    "css3": "CSS3",
    "rest api": "REST API",
    "restful api": "REST API",
    "ci/cd": "CI/CD",
    "aws": "AWS",
    "gcp": "GCP",
    "sql": "SQL",
    "nlp": "NLP",
    "ai": "AI",
    "ml": "Machine Learning",
    "scikit-learn": "Scikit-Learn",
    "sklearn": "Scikit-Learn",
    "power bi": "Power BI",
    "t-sql": "SQL",
    "pl/sql": "PL/SQL",
    "postgres": "PostgreSQL",
    "golang": "Go",
}

def get_all_skills_flat():
    """Returns a unified set of all unique lowercase skill terms across categories."""
    flat_skills = set()
    for cat, skills in SKILLS_DATABASE.items():
        for skill in skills:
            flat_skills.add(skill.lower())
    return flat_skills

def normalize_skill_name(skill_str: str) -> str:
    """Formats a skill string into its clean canonical display name (e.g. python -> Python, aws -> AWS)."""
    lowered = skill_str.strip().lower()
    if lowered in CANONICAL_SKILL_NAMES:
        return CANONICAL_SKILL_NAMES[lowered]
    
    # Capitalize multi-word or single word properly
    words = lowered.split()
    capitalized = [w.capitalize() for w in words]
    return " ".join(capitalized)

def extract_skills_from_text(text: str):
    """
    Extracts tech skills from text using boundary-safe pattern matching.
    Returns a sorted list of unique canonical skill names.
    """
    if not text:
        return []

    text_lower = text.lower()
    found_skills = set()
    all_flat_skills = get_all_skills_flat()

    for skill in all_flat_skills:
        # Build boundary safe regex pattern
        if skill in [".net", "c++", "c#", "ci/cd"]:
            pattern = r"(?:\b|\s)" + re.escape(skill) + r"(?:\b|\s)"
        elif len(skill) <= 3:  # short skills like c, r, go, aws, gcp, sql
            pattern = r"\b" + re.escape(skill) + r"\b"
        else:
            pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, text_lower):
            found_skills.add(normalize_skill_name(skill))

    return sorted(list(found_skills))
