import re

# Technical terms with special characters to protect during normalization
PROTECTED_TERMS = {
    "c++": "CPP_TOKEN",
    "c#": "CSHARP_TOKEN",
    ".net": "DOTNET_TOKEN",
    "node.js": "NODEJS_TOKEN",
    "react.js": "REACTJS_TOKEN",
    "vue.js": "VUEJS_TOKEN",
    "express.js": "EXPRESSJS_TOKEN",
    "ci/cd": "CICD_TOKEN",
    "tcp/ip": "TCPIP_TOKEN",
    "restful api": "RESTFULAPI_TOKEN",
    "rest api": "RESTAPI_TOKEN",
}

REVERSE_PROTECTED = {v: k for k, v in PROTECTED_TERMS.items()}

# Basic English stopwords list (lightweight, zero external download dependencies)
STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't",
    "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
    "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having",
    "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how",
    "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself",
    "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once",
    "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
    "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the",
    "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll",
    "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't",
    "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where",
    "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't",
    "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"
}

def clean_text(text: str) -> str:
    """
    Cleans and normalizes text for NLP processing.
    1. Converts to lowercase.
    2. Protects technical terms like C++, C#, .NET, Node.js.
    3. Removes punctuation except protected tokens.
    4. Normalizes whitespace.
    """
    if not text:
        return ""

    lowered = text.lower()

    # Protect technical terms
    for term, token in PROTECTED_TERMS.items():
        # Match term with word boundary or non-alphanumeric wrap
        pattern = re.escape(term)
        lowered = re.sub(pattern, token, lowered)

    # Remove non-alphanumeric characters except underscore and spaces
    cleaned = re.sub(r"[^\w\s]", " ", lowered)

    # Revert protected tokens back to readable representation
    for token, original in REVERSE_PROTECTED.items():
        cleaned = cleaned.replace(token, original)
        cleaned = cleaned.replace(token.lower(), original)

    # Normalize whitespace
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned

def preprocess_for_tfidf(text: str) -> str:
    """
    Preprocesses text specifically for TF-IDF vectorization:
    Cleans text, preserves technical terms, and removes generic stopwords.
    """
    cleaned = clean_text(text)
    words = cleaned.split()
    filtered_words = [w for w in words if w not in STOPWORDS or w in PROTECTED_TERMS]
    return " ".join(filtered_words)
