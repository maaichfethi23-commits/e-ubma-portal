import React from 'react';

export default function Home({ t }) {
  return (
    <div className="page-content">
      <div className="page-header">
        <h2>{t.home_welcome}</h2>
        <p style={{ color: 'var(--text-muted)' }}>{t.home_sub}</p>
      </div>

      <div className="dashboard-grid">
        <div className="card" style={{ 
          background: 'rgba(255, 255, 255, 0.03)', 
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px'
        }}>
          <h3 style={{ color: 'var(--accent)', marginBottom: '15px' }}>{t.home_news_title}</h3>
          <p>{t.home_news_desc}</p>
          <button className="btn-primary" style={{ width: '100%' }}>{t.home_news_btn}</button>
        </div>

        <div className="card" style={{ 
          background: 'rgba(59, 130, 246, 0.05)', 
          border: '1px solid rgba(59, 130, 246, 0.2)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px'
        }}>
          <h3 style={{ color: '#10b981', marginBottom: '15px' }}>{t.home_exam_title}</h3>
          <p>{t.home_exam_mod}</p>
          <p style={{ fontWeight: 'bold', color: 'var(--accent)', fontSize: '1.2rem', marginTop: '10px' }}>{t.home_exam_date}</p>
        </div>
      </div>
    </div>
  );
}
