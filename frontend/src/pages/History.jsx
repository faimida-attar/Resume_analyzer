import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { resumeAPI } from '../services/api';
import { History as HistoryIcon, Calendar, Trash2, Eye, RefreshCw, FileText, Search } from 'lucide-react';

export default function History({ user, setUser }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await resumeAPI.getHistory();
      if (res.success) {
        setHistory(res.history);
      }
    } catch (err) {
      setError('Failed to load analysis history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis record?')) return;

    try {
      const res = await resumeAPI.deleteAnalysis(id);
      if (res.success) {
        setHistory(history.filter(item => item.id !== id));
      }
    } catch (err) {
      alert('Failed to delete analysis record.');
    }
  };

  const filteredHistory = history.filter(item =>
    item.resume_filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.job_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '2rem' }}>
      <Sidebar user={user} setUser={setUser} />

      <main style={{ flexGrow: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <HistoryIcon color="#38bdf8" size={26} />
              Analysis History
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Review past resume evaluations, similarity scores, and saved recommendations.
            </p>
          </div>

          <div style={{ position: 'relative', minWidth: '260px' }}>
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
            />
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 0.5rem auto' }} />
            Loading saved analyses...
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="glass-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Resume File</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Similarity</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Skill Match</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Quality</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate('/results', { state: { result: item } })}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} /> {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                      {item.resume_filename}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-info">{item.similarity_score}%</span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-success">{item.skill_match_score}%</span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#10b981' }}>
                      {item.resume_quality_score}/100
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate('/results', { state: { result: item } }); }}
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="btn-danger"
                          style={{ padding: '0.35rem 0.65rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <FileText size={40} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8' }}>No analysis history found</div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Your saved resume evaluations will appear here.</div>
          </div>
        )}
      </main>
    </div>
  );
}
