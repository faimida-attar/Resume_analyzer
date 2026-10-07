import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { resumeAPI } from '../services/api';
import { User, Mail, Calendar, Shield, Cpu, Award } from 'lucide-react';

export default function Profile({ user, setUser }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    resumeAPI.getDashboardStats().then(res => {
      if (res.success) setStats(res.stats);
    }).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', gap: '2rem' }}>
      <Sidebar user={user} setUser={setUser} />

      <main style={{ flexGrow: 1, minWidth: 0 }}>
        <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.5rem',
              fontWeight: 800
            }}>
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                {user?.name || 'User Profile'}
              </h2>
              <div style={{ fontSize: '0.875rem', color: '#38bdf8', fontWeight: 600 }}>
                Registered Account
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ padding: '1rem 1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>FULL NAME</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} color="#38bdf8" /> {user?.name}
              </div>
            </div>

            <div style={{ padding: '1rem 1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>EMAIL ADDRESS</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="#38bdf8" /> {user?.email}
              </div>
            </div>

            <div style={{ padding: '1rem 1.25rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>TOTAL RESUME ANALYSES</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={16} color="#34d399" /> {stats?.total_analyses || 0} Saved Evaluations
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
