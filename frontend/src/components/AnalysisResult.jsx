import React from 'react';
import { Layout, Check, X, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

export default function AnalysisResult({ sectionAnalysis = {}, atsResult = {} }) {
  const sections = sectionAnalysis.sections || {};
  const atsChecks = atsResult.checks || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
      {/* 1. Resume Section Analysis */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Layout color="#0ea5e9" size={20} />
          Resume Section Analysis
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {Object.entries(sections).map(([sec, status]) => {
            const isPresent = status === 'Present';
            return (
              <div key={sec} style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                background: isPresent ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${isPresent ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                  {sec}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: isPresent ? '#34d399' : '#fca5a5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}>
                  {isPresent ? <Check size={14} /> : <X size={14} />}
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. ATS Readiness Checklist */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck color="#10b981" size={20} />
            ATS Readiness Checklist
          </h4>
          <span className={`badge ${atsResult.overall_ats_status === 'Good' ? 'badge-success' : 'badge-warning'}`}>
            {atsResult.overall_ats_status || 'Good'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {atsChecks.map((check, idx) => (
            <div key={idx} style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                  {check.title}
                </span>
                <span className={`badge ${check.status === 'PASS' ? 'badge-success' : check.status === 'WARNING' ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>
                  {check.status}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                {check.details}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
