import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Cpu, Target, ShieldCheck, Zap, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export default function Home({ user }) {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 1rem 3rem 1rem', position: 'relative' }}>
        <div className="badge badge-info" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <Sparkles size={16} /> Powered by TF-IDF, Cosine Similarity & NLP Engine
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '1.25rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #38bdf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          AI Resume Analyzer & Job Matcher
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: '#94a3b8',
          maxWidth: '750px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6
        }}>
          Analyze your resume, compare it with target job descriptions, discover missing technical skills, calculate similarity scores, and improve your chances of getting shortlisted.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to={user ? "/analyze" : "/register"} className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            <Sparkles size={20} />
            Analyze Resume Now
          </Link>
          {!user && (
            <Link to="/login" className="btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
              Login to Save History
            </Link>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ marginTop: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>How It Works</h2>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Four transparent steps to optimize your resume for target job descriptions.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            { step: '01', title: 'Upload PDF Resume', desc: 'pdfplumber extracts text cleanly from text-based PDF resumes without exposing personal data.', icon: FileText },
            { step: '02', title: 'Paste Job Description', desc: 'Input the job posting text. The system cleans stop words while preserving technical symbols.', icon: Target },
            { step: '03', title: 'TF-IDF & Cosine Match', desc: 'scikit-learn converts text into TF-IDF vector representations and calculates exact cosine similarity.', icon: Cpu },
            { step: '04', title: 'Review Results', desc: 'Get matched skills, missing required vs preferred skills, ATS check, and actionable suggestions.', icon: CheckCircle2 }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'rgba(56, 189, 248, 0.2)',
                  position: 'absolute',
                  top: '1rem',
                  right: '1.5rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  {item.step}
                </div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                  marginBottom: '1rem'
                }}>
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI / NLP Technology Explanation Section */}
      <section className="glass-card" style={{ marginTop: '5rem', padding: '3rem 2.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="badge badge-info" style={{ marginBottom: '1rem' }}>
            <Cpu size={14} /> Local NLP & Machine Learning Concepts
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem' }}>
            Why TF-IDF + Cosine Similarity?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Unlike black-box deep learning models that require heavy GPU compute, this system uses deterministic, interpretable NLP algorithms that run fast and locally.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>
                TF-IDF Vectorization
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                Term Frequency-Inverse Document Frequency evaluates word importance. It weights rare technical terms (e.g. <code>PyTorch</code>, <code>Docker</code>) higher than generic words.
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.5rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem' }}>
                Cosine Similarity
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                Calculates the cosine of the angle between resume and job TF-IDF vectors:
                <br />
                <code style={{ color: '#34d399', fontSize: '0.85rem' }}>Sim(A,B) = (A · B) / (||A|| ||B||)</code>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
        <div>AI Resume Analyzer & Job Matcher &copy; {new Date().getFullYear()} — Built with React, Flask, Scikit-Learn & SQLite</div>
      </footer>
    </div>
  );
}
