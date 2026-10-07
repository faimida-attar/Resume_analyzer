import React from 'react';
import { Target, Zap, Award, HelpCircle } from 'lucide-react';

export default function ScoreCard({ similarityScore, skillMatchScore, qualityScore }) {
  const getScoreColor = (score) => {
    if (score >= 75) return '#10b981'; // Emerald
    if (score >= 50) return '#f59e0b'; // Amber
    return '#ef4444';                   // Red
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
      {/* 1. TF-IDF Cosine Similarity Card */}
      <div className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Overall Similarity
          </span>
          <Target color="#0ea5e9" size={20} />
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '1rem' }}>
          <span style={{ fontSize: '3rem', fontWeight: 800, color: getScoreColor(similarityScore), lineHeight: 1 }}>
            {similarityScore}%
          </span>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
            TF-IDF Cosine
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginTop: '1.25rem', overflow: 'hidden' }}>
          <div style={{
            width: `${similarityScore}%`,
            height: '100%',
            background: `linear-gradient(90deg, #0ea5e9, ${getScoreColor(similarityScore)})`,
            borderRadius: '4px',
            transition: 'width 1s ease-in-out'
          }} />
        </div>

        <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '0.75rem' }}>
          Measures semantic vector overlap between resume text and job vocabulary.
        </div>
      </div>

      {/* 2. Skill Match Score Card */}
      <div className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Skill Match Score
          </span>
          <Zap color="#6366f1" size={20} />
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '1rem' }}>
          <span style={{ fontSize: '3rem', fontWeight: 800, color: getScoreColor(skillMatchScore), lineHeight: 1 }}>
            {skillMatchScore}%
          </span>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
            Required Skills
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginTop: '1.25rem', overflow: 'hidden' }}>
          <div style={{
            width: `${skillMatchScore}%`,
            height: '100%',
            background: `linear-gradient(90deg, #6366f1, ${getScoreColor(skillMatchScore)})`,
            borderRadius: '4px',
            transition: 'width 1s ease-in-out'
          }} />
        </div>

        <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '0.75rem' }}>
          Ratio of technical skills present in resume versus skills required by job.
        </div>
      </div>

      {/* 3. Resume Quality Score Card */}
      <div className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Resume Quality Score
          </span>
          <Award color="#10b981" size={20} />
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '1rem' }}>
          <span style={{ fontSize: '3rem', fontWeight: 800, color: getScoreColor(qualityScore), lineHeight: 1 }}>
            {qualityScore}
          </span>
          <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 700 }}>
            / 100
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginTop: '1.25rem', overflow: 'hidden' }}>
          <div style={{
            width: `${qualityScore}%`,
            height: '100%',
            background: `linear-gradient(90deg, #10b981, ${getScoreColor(qualityScore)})`,
            borderRadius: '4px',
            transition: 'width 1s ease-in-out'
          }} />
        </div>

        <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '0.75rem' }}>
          Evaluates section presence, measurable metrics, and formatting readability.
        </div>
      </div>
    </div>
  );
}
