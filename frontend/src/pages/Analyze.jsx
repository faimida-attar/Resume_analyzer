import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ResumeUpload from '../components/ResumeUpload';
import JobDescription from '../components/JobDescription';
import { resumeAPI } from '../services/api';
import { Sparkles, AlertCircle, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';

export default function Analyze({ user, setUser }) {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [resumeFilename, setResumeFilename] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [extractedData, setExtractedData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');

  const steps = [
    'Reading PDF text & validating structure...',
    'Cleaning text & preserving technical tokens...',
    'Detecting skills across 8 domain categories...',
    'Building TF-IDF vectors & calculating Cosine Similarity...',
    'Checking ATS readiness & generating recommendations...'
  ];

  const handleTextExtracted = (text, filename) => {
    setResumeText(text);
    setResumeFilename(filename);
  };

  const handleRunAnalysis = async () => {
    setError('');

    if (!resumeText) {
      setError('Please upload a valid PDF resume first.');
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 10) {
      setError('Please enter a detailed job description.');
      return;
    }

    setLoading(true);
    setStepIndex(0);

    // Simulate multi-step progress for user experience
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    try {
      const payload = {
        resume_text: resumeText,
        job_description: jobDescription,
        resume_filename: resumeFilename || 'resume.pdf'
      };

      const res = await resumeAPI.analyzeResume(payload);
      clearInterval(interval);

      if (res.success) {
        navigate('/results', { state: { result: res.data } });
      } else {
        setError(res.message || 'Analysis failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      clearInterval(interval);
      setError(err.response?.data?.message || 'Server error running analysis.');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '2rem' }}>
      <Sidebar user={user} setUser={setUser} />

      <main style={{ flexGrow: 1, minWidth: 0 }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles color="#38bdf8" size={28} />
            Analyze Resume vs Job Description
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Upload your resume PDF and paste the job description below to get instant TF-IDF similarity scores and skill matching analysis.
          </p>
        </div>

        {error && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '0.85rem 1.15rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            color: '#fca5a5',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Loading Stepper View */}
        {loading ? (
          <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(14,165,233,0.2))',
              border: '1px solid rgba(14,165,233,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              margin: '0 auto 1.5rem auto'
            }}>
              <RefreshCw className="animate-spin" size={32} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Analyzing Resume...
            </h3>
            <p style={{ color: '#38bdf8', fontSize: '0.95rem', fontWeight: 600 }}>
              {steps[stepIndex]}
            </p>

            <div style={{ maxWidth: '400px', margin: '2rem auto 0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {steps.map((st, idx) => (
                <div key={idx} style={{
                  fontSize: '0.825rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: idx <= stepIndex ? '#34d399' : '#64748b'
                }}>
                  <CheckCircle2 size={14} color={idx <= stepIndex ? '#34d399' : '#475569'} />
                  {st}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <ResumeUpload
              onTextExtracted={handleTextExtracted}
              extractedData={extractedData}
              setExtractedData={setExtractedData}
            />

            <JobDescription
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
            />

            <div style={{ textAlign: 'right' }}>
              <button
                onClick={handleRunAnalysis}
                className="btn-primary"
                style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem' }}
              >
                <Sparkles size={20} />
                Run AI Match Analysis
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
