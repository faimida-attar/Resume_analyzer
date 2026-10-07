# ResuMatch AI - Resume Analyzer

An intelligent, full-stack Resume Analyzer application that leverages NLP (Natural Language Processing) and TF-IDF matching to analyze resumes against job descriptions. It provides users with similarity scores, ATS readiness checks, skill extractions, and actionable AI-driven suggestions to improve their chances of landing an interview.

## 🚀 Features

- **Automated Resume Parsing:** Extracts clean text from PDF resumes using `pdfplumber`.
- **Smart Matching Engine:** Calculates a TF-IDF similarity score and a skill match percentage against a provided job description.
- **ATS Formatting Checker:** Evaluates standard resume sections (Skills, Experience, Projects) to ensure readability by Applicant Tracking Systems.
- **AI-Driven Suggestions:** Identifies missing required/preferred skills and generates prioritized recommendations to improve the resume.
- **User Authentication:** Secure JWT-based registration and login system.
- **Dashboard & History:** Users can track their past analyses, average scores, and improvements over time.
- **Dockerized Environment:** Fully containerized with Docker Compose for seamless local development.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TailwindCSS (or Vanilla CSS for dynamic styling), Axios.
- **Backend:** Python, Flask, Flask-CORS, PyJWT, Scikit-learn (for TF-IDF).
- **Database:** MongoDB (MongoEngine ODM).
- **Infrastructure:** Docker, Docker Compose.

## 📦 How to Run Locally

### Prerequisites
Make sure you have [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer
```

### 2. Configure Environment Variables
Create a `.env` file inside the `backend` directory with the following variables:
```env
FLASK_SECRET_KEY=your-flask-secret
JWT_SECRET_KEY=your-jwt-secret
MONGO_URI=mongodb://mongodb:27017/resume_analyzer
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216
LLM_API_KEY=your-optional-api-key
```

### 3. Start the Application
Run the following command in the root directory to build and start the containers:
```bash
docker-compose up --build -d
```

### 4. Access the App
- **Frontend / UI:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **MongoDB Database:** Accessible locally at `mongodb://localhost:27018/resume_analyzer` (Compass).

## 🛑 Stopping the Application
To safely shut down the containers without losing your database data:
```bash
docker-compose down
```

## 📝 License
This project is licensed under the MIT License.
