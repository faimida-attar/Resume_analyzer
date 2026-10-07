import React from 'react';
import { Lightbulb, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function Suggestions({ suggestions = [] }) {
  const getPriorityBadgeClass = (type) => {
    if (type === 'High Priority') return 'badge-danger';
    if (type === 'Medium Priority') return 'badge-warning';
    return 'badge-info';
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <Lightbulb color="#fbbf24" size={20} />
        Actionable Resume Improvement Suggestions ({suggestions.length})
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {suggestions.map((item, idx) => (
          <div key={idx} style={{
            padding: '1rem 1.15rem',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(251, 191, 36, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24',
              flexShrink: 0
            }}>
              <ArrowUpRight size={18} />
            </div>

            <div style={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
                  {item.category}
                </span>
                <span className={`badge ${getPriorityBadgeClass(item.type)}`} style={{ fontSize: '0.725rem' }}>
                  {item.type}
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#f8fafc', lineHeight: '1.5' }}>
                {item.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
