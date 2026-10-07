import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FileText, Cpu, LayoutDashboard, LogOut, User, Sparkles } from 'lucide-react';
import { authAPI } from '../services/api';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '0.85rem 1.75rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Cpu size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', tracking: '-0.02em', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ResuMatch <span style={{ color: '#38bdf8', WebkitTextFillColor: '#38bdf8' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
              TF-IDF & NLP Resume Engine
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: isActive('/') ? '#38bdf8' : '#94a3b8',
            transition: 'color 0.2s'
          }}>
            Home
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: isActive('/dashboard') ? '#38bdf8' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <LayoutDashboard size={16} />
                Dashboard
              </Link>

              <Link to="/analyze" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <Sparkles size={16} />
                Analyze Resume
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem', paddingLeft: '0.75rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f8fafc', fontSize: '0.875rem', fontWeight: 600 }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={16} color="#38bdf8" />
                  </div>
                  {user.name.split(' ')[0]}
                </Link>

                <button onClick={handleLogout} style={{ background: 'transparent', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
