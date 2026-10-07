import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { resumeAPI } from '../services/api';

export default function ResumeUpload({ onTextExtracted, extractedData, setExtractedData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const processFile = async (file) => {
    setError('');
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setError('Please upload a valid text-based PDF file (.pdf).');
      return;
    }

    if (file.size > 16 * 1024 * 1024) {
      setError('File size exceeds 16MB limit.');
      return;
    }

    setLoading(true);
    try {
      const res = await resumeAPI.uploadResume(file);
      if (res.success) {
        setExtractedData(res);
        onTextExtracted(res.extracted_text, res.filename);
      } else {
        setError(res.message || 'Failed to parse PDF resume.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error processing PDF file. Please ensure it is text-readable.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setExtractedData(null);
    onTextExtracted('', '');
    setError('');
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText color="#38bdf8" size={20} />
          1. Upload PDF Resume
        </h3>
        {extractedData && (
          <button onClick={handleReset} className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
            <RefreshCw size={14} /> Change File
          </button>
        )}
      </div>

      {extractedData ? (
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34d399'
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
              {extractedData.filename}
            </div>
            <div style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '0.15rem' }}>
              Extracted {extractedData.word_count} words cleanly via pdfplumber
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.15)'}`,
            background: dragActive ? 'rgba(14, 165, 233, 0.08)' : 'rgba(15, 23, 42, 0.6)',
            borderRadius: '14px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
        >
          <input
            type="file"
            id="pdf-upload-input"
            accept=".pdf"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="pdf-upload-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(14,165,233,0.2))',
              border: '1px solid rgba(14,165,233,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              {loading ? <RefreshCw className="animate-spin" size={28} /> : <UploadCloud size={28} />}
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#f8fafc' }}>
                {loading ? 'Reading & Extracting Resume Text...' : 'Click to upload or drag & drop PDF'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
                Supports text-based PDF files up to 16MB
              </div>
            </div>
          </label>
        </div>
      )}

      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#fca5a5',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
