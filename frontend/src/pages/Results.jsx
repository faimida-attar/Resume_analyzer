import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ScoreCard from '../components/ScoreCard';
import SkillList from '../components/SkillList';
import AnalysisResult from '../components/AnalysisResult';
import Suggestions from '../components/Suggestions';
import { Sparkles, Calendar, FileText, HelpCircle, ArrowLeft, Printer, RefreshCw } from 'lucide-react';

export default function Results({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '2rem' }}>
        <Sidebar user={user} setUser={setUser} />
        <main style={{ flexGrow: 1, padding: '3rem', textAlign: 'center' }}>
          <div className="glass-card" style={{ padding: '3rem' }}>
            <FileText size={48} color="#64748b" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>No Analysis Result Found</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              Please upload a resume and job description to generate an analysis.
            </p>
            <Link to="/analyze" className="btn-primary" style={{ display: 'inline-flex' }}>
              <Sparkles size={18} /> Go to Analyze Resume
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '2rem' }}>
      <Sidebar user={user} setUser={setUser} />

      <main style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Results Header */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ background: 'transparent', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              Analysis Report: <span style={{ color: '#38bdf8' }}>{result.resume_filename}</span>
            </h1>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} /> Analyzed on {new Date(result.created_at || Date.now()).toLocaleDateString()}
              </span>
              <span>Matched Skills: {result.matched_skills?.length || 0}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handlePrint} className="btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
              <Printer size={16} /> Print Report
            </button>
            <Link to="/analyze" className="btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
              <RefreshCw size={16} /> Analyze Another
            </Link>
          </div>
        </div>

        {/* 1. Score Summary Cards */}
        <ScoreCard
          similarityScore={result.similarity_score}
          skillMatchScore={result.skill_match_score}
          qualityScore={result.resume_quality_score}
        />

        {/* 2. Skills Breakdown */}
        <SkillList
          matchedSkills={result.matched_skills}
          missingSkills={result.missing_skills}
          requiredMissing={result.required_missing_skills}
          preferredMissing={result.preferred_missing_skills}
        />

        {/* 3. Section Analysis & ATS Checklist */}
        <AnalysisResult
          sectionAnalysis={result.section_analysis}
          atsResult={result.ats_result}
        />

        {/* 4. Actionable Suggestions */}
        <Suggestions suggestions={result.suggestions} />

        {/* 5. Score Explanation Note */}
        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(15, 23, 42, 0.8)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <HelpCircle size={16} /> How are these scores calculated?
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
            • <strong>Overall Text Similarity ({result.similarity_score}%):</strong> Evaluates total vocabulary overlap using TF-IDF vectorization and Cosine Similarity (Sim(A, B) = (A · B) / (||A|| × ||B||)).
            <br />
            • <strong>Skill Match ({result.skill_match_score}%):</strong> Ratio of technical skills present in the resume against required job skills.
            <br />
            • <strong>Resume Quality ({result.resume_quality_score}/100):</strong> Checks structural section presence (Education, Skills, Experience, Projects), readability, and measurable metric count (e.g. %, $).
            <br />
            <span style={{ fontStyle: 'italic', color: '#64748b' }}>* Note: These scores are algorithmic indicators of content alignment, not guarantees of employment or proprietary third-party vendor ATS scores.</span>
          </p>
        </div>
      </main>
    </div>
  );
}
