import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Cpu } from 'lucide-react';

export default function SkillList({ matchedSkills = [], missingSkills = [], requiredMissing = [], preferredMissing = [] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
      {/* Matched Skills */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <CheckCircle2 size={18} />
          Matched Skills ({matchedSkills.length})
        </h4>

        {matchedSkills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {matchedSkills.map((skill, i) => (
              <span key={i} className="badge badge-success">
                <CheckCircle2 size={12} />
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '0.875rem', color: '#64748b', fontStyle: 'italic' }}>
            No overlapping technical skills detected.
          </div>
        )}
      </div>

      {/* Required Missing Skills */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <XCircle size={18} />
          Required Missing Skills ({requiredMissing.length})
        </h4>

        {requiredMissing.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {requiredMissing.map((skill, i) => (
              <span key={i} className="badge badge-danger">
                <XCircle size={12} />
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ fontSize: '0.875rem', color: '#34d399', fontWeight: 600 }}>
            🎉 All required job skills detected in your resume!
          </div>
        )}
      </div>

      {/* Preferred Missing Skills */}
      {preferredMissing.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={18} />
            Preferred / Bonus Missing Skills ({preferredMissing.length})
          </h4>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {preferredMissing.map((skill, i) => (
              <span key={i} className="badge badge-warning">
                <AlertTriangle size={12} />
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
