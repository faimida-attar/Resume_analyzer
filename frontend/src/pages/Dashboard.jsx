import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { resumeAPI } from '../services/api';
import { Sparkles, FileText, Target, Zap, Award, ArrowRight, RefreshCw, Calendar } from 'lucide-react';

export default function Dashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await resumeAPI.getDashboardStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      setError('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '2rem' }}>
      <Sidebar user={user} setUser={setUser} />

      <main style={{ flexGrow: 1, minWidth: 0 }}>
        {/* Welcome Header */}
        <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Analyze new resume PDFs, track match scores, and review detailed improvement recommendations.
            </p>
          </div>

          <Link to="/analyze" className="btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
            <Sparkles size={18} />
            New Resume Analysis
          </Link>
        </div>

        {/* Statistics Cards */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 0.5rem auto' }} />
            Loading summary metrics...
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Analyses</span>
                  <FileText color="#38bdf8" size={18} />
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.5rem' }}>
                  {stats?.total_analyses || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Evaluations stored in database</div>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Avg Similarity</span>
                  <Target color="#0ea5e9" size={18} />
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0ea5e9', marginTop: '0.5rem' }}>
                  {stats?.avg_similarity_score || 0}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>TF-IDF Cosine Score</div>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Avg Skill Match</span>
                  <Zap color="#6366f1" size={18} />
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#6366f1', marginTop: '0.5rem' }}>
                  {stats?.avg_skill_match || 0}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Required Skill Ratio</div>
              </div>

              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Avg Quality Score</span>
                  <Award color="#10b981" size={18} />
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981', marginTop: '0.5rem' }}>
                  {stats?.avg_quality_score || 0}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Structural & Formatting Quality</div>
              </div>
            </div>

            {/* Recent Analyses Section */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                  Recent Resume Analyses
                </h3>
                <Link to="/history" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              {stats?.recent_analyses && stats.recent_analyses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {stats.recent_analyses.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/results`, { state: { result: item } })}
                      style={{
                        padding: '1rem 1.25rem',
                        borderRadius: '12px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                          {item.resume_filename}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString()}
                          </span>
                          <span>Matched Skills: {item.matched_skills.length}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                            {item.similarity_score}%
                          </div>
                          <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Similarity</div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>
                            {item.resume_quality_score}
                          </div>
                          <div style={{ fontSize: '0.725rem', color: '#64748b' }}>Quality</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                  <FileText size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#94a3b8' }}>No resume analyses yet</div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Upload a PDF resume and paste a job description to get started!</div>
                  <Link to="/analyze" className="btn-primary" style={{ marginTop: '1.25rem', display: 'inline-flex' }}>
                    Run Your First Analysis
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
