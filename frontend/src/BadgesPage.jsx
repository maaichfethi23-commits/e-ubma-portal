import React from 'react';

export default function BadgesPage({ events, t }) {
  const badges = events.filter(e => e.intent === 'validate_badge');

  const handleLinkedInShare = async (badgeName) => {
    try {
      const res = await fetch('/api/badges/linkedin-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          badge_name: badgeName,
          year: '2024',
          month: '6',
          vault_link: 'https://verify.e-ubma.dz/sample'
        })
      });
      const data = await res.json();
      window.open(data.linkedin_add_url, '_blank');
    } catch (err) {
      alert('Erreur de connexion. / خطأ في الاتصال.');
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>{t.badges_title}</h2>
        <p style={{ color: 'var(--text-muted)' }}>{t.badges_sub}</p>
      </div>

      <div className="dashboard-grid">
        {badges.length === 0 ? (
           <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
             <p style={{ color: 'var(--text-muted)' }}>{t.badges_empty}</p>
           </div>
        ) : (
          badges.map((badge, idx) => (
            <div key={idx} className="card">
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏅</div>
              <h3>{t.badges_card_title}</h3>
              <p>{t.badges_active}</p>
              <button onClick={() => handleLinkedInShare('Compétence UBMA')} className="btn-primary" style={{ background: '#0077b5' }}>
                {t.badges_btn}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
