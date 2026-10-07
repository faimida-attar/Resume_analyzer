from datetime import datetime, timezone
from mongoengine import Document, StringField, DateTimeField, FloatField, ReferenceField, DictField, ListField, CASCADE
from werkzeug.security import generate_password_hash, check_password_hash

class User(Document):
    meta = {'collection': 'users'}

    name = StringField(required=True, max_length=100)
    email = StringField(required=True, unique=True)
    password_hash = StringField(required=True)
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class ResumeAnalysis(Document):
    meta = {'collection': 'resume_analyses'}

    user_id = ReferenceField(User, reverse_delete_rule=CASCADE, required=True)
    resume_filename = StringField(required=True)
    resume_text = StringField(required=True)
    job_description = StringField(required=True)
    similarity_score = FloatField(required=True)
    skill_match_score = FloatField(required=True)
    resume_quality_score = FloatField(required=True)
    
    matched_skills = ListField(StringField(), default=list)
    missing_skills = ListField(StringField(), default=list)
    required_missing_skills = ListField(StringField(), default=list)
    preferred_missing_skills = ListField(StringField(), default=list)
    section_analysis = DictField(default=dict)
    ats_result = DictField(default=dict)
    suggestions = ListField(DictField(), default=list)
    
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id.id) if self.user_id else None,
            "resume_filename": self.resume_filename,
            "resume_text": self.resume_text,
            "job_description": self.job_description,
            "similarity_score": round(self.similarity_score, 1),
            "skill_match_score": round(self.skill_match_score, 1),
            "resume_quality_score": round(self.resume_quality_score, 1),
            "matched_skills": self.matched_skills,
            "missing_skills": self.missing_skills,
            "required_missing_skills": self.required_missing_skills,
            "preferred_missing_skills": self.preferred_missing_skills,
            "section_analysis": self.section_analysis,
            "ats_result": self.ats_result,
            "suggestions": self.suggestions,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
