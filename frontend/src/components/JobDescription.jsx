import React from 'react';
import { Briefcase, Eraser, Sparkles } from 'lucide-react';

const SAMPLE_JOB_DESCRIPTION = `We are looking for a Python Developer with experience in Python, Flask, SQL, Pandas, NumPy, REST APIs, and Machine Learning. The candidate will build scalable backend services, process datasets, and optimize database queries using PostgreSQL or SQLite. Experience with Docker, AWS, and Git is preferred.`;

export default function JobDescription({ jobDescription, setJobDescription }) {
  const handleLoadSample = () => {
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
  };

  const handleClear = () => {
    setJobDescription('');
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase color="#38bdf8" size={20} />
          2. Enter Job Description
        </h3>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleLoadSample}
            type="button"
            className="btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          >
            <Sparkles size={14} color="#fbbf24" /> Load Sample Job
          </button>
          {jobDescription && (
            <button
              onClick={handleClear}
              type="button"
              className="btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              <Eraser size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste target job description here (responsibilities, required skills, qualifications)..."
        rows={7}
        className="form-input"
        style={{
          resize: 'vertical',
          fontFamily: 'inherit',
          lineHeight: '1.5',
          fontSize: '0.925rem'
        }}
      />

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '0.5rem',
        fontSize: '0.8rem',
        color: '#64748b'
      }}>
        <div>Minimum 20 characters recommended for accurate TF-IDF vectorization.</div>
        <div style={{ fontFamily: 'var(--font-mono)' }}>
          {jobDescription.length} characters
        </div>
      </div>
    </div>
  );
}
