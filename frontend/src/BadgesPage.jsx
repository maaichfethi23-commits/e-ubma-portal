import React from 'react';

export default function BadgesPage({ events }) {
  const badges = events.filter(e => e.intent === 'validate_badge');

  const handleLinkedInShare = async (badgeName) => {
    try {
      const res = await fetch('http://localhost:8000/api/badges/linkedin-url', {
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
      alert("Erreur lors de la génération du lien LinkedIn");
    }
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Open Badges</h2>
        <p style={{ color: 'var(--text-muted)' }}>Vos certifications et compétences validées.</p>
      </div>

      <div className="dashboard-grid">
        {badges.length === 0 ? (
           <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
             <p style={{ color: 'var(--text-muted)' }}>Aucun badge. Demandez à l'assistant AI de valider vos compétences!</p>
           </div>
        ) : (
          badges.map((badge, idx) => (
            <div key={idx} className="card">
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏅</div>
              <h3>Badge: Compétence UBMA</h3>
              <p>Validation: Active</p>
              <button onClick={() => handleLinkedInShare('Compétence UBMA')} className="btn-primary" style={{ background: '#0077b5' }}>
                + Ajouter au profil LinkedIn
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
