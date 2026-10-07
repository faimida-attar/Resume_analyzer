import os
from mongoengine import connect

def init_db(app):
    mongo_uri = app.config.get("MONGO_URI") or os.environ.get("MONGO_URI", "mongodb://mongodb:27017/resume_analyzer")
    connect(host=mongo_uri)
