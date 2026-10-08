# ResuMatch AI - Resume Analyzer

🚀 **Live Demo:** [https://resume-analyzer-1-8h14.onrender.com](https://resume-analyzer-1-8h14.onrender.com)

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

## ☁️ How to Deploy to Render

This project is configured for extremely easy deployment using Render's free tier. 

### 1. Deploy the Backend
1. Create a new account on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the **Root Directory** to `backend`.
5. Render will automatically detect the `Dockerfile` and build the Python API.
6. Under **Environment**, add your `.env` variables (like `FLASK_SECRET_KEY`, `JWT_SECRET_KEY`, and a cloud `MONGO_URI` from MongoDB Atlas).

### 2. Deploy the Frontend
1. Back on the Render Dashboard, click **New +** and select **Static Site**.
2. Connect the same GitHub repository.
3. Set the **Root Directory** to `frontend`.
4. Set the **Build Command** to `npm run build`.
5. Set the **Publish directory** to `dist`.
6. Add an Environment Variable named `VITE_API_URL` and set its value to your live backend URL (e.g., `https://your-backend.onrender.com/api`).
7. Click **Create Static Site**.

## 🐳 Docker Guide & Commands

This project uses Docker to create isolated environments for both the frontend and backend. Here are the core commands used to manage the images and containers:

### 1. Build and Run Everything (Most Common)
```bash
docker-compose up --build
```
* **What it does:** Reads the `docker-compose.yml` file, builds custom images for the React frontend and Python backend, starts the MongoDB database, and runs all containers in a connected network.*

### 2. Stop and Remove Containers
```bash
docker-compose down
```
* **What it does:** Safely stops all running containers and removes the virtual network. Your database data is preserved in a Docker volume.*

### 3. Build a Specific Image Manually
If you want to manually build just the backend image:
```bash
cd backend
docker build -t resume-analyzer-backend .
```
* **What it does:** Reads the `Dockerfile` inside the backend folder and creates a reusable image named `resume-analyzer-backend`.*

### 4. Run a Specific Container Manually
```bash
docker run -p 5000:5000 resume-analyzer-backend
```
* **What it does:** Starts a container using the image you just built and maps it to port 5000 on your local machine.*

### 5. View Live Logs
```bash
docker-compose logs -f
```
* **What it does:** Streams the live console output from all running containers, which is highly useful for debugging.*

## 🛑 Stopping the Application
To safely shut down the local Docker containers without losing your database data:
```bash
docker-compose down
```

## 📝 License
This project is licensed under the MIT License.
