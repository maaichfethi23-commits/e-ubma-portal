import React from 'react';

export default function Home() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h2>Bienvenue, Ahmed!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Voici un résumé de vos activités universitaires.</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Actualités UBMA</h3>
          <p>Le délai des inscriptions universitaires a été prolongé jusqu'au 15 Octobre.</p>
          <button className="btn-primary">Voir plus</button>
        </div>

        <div className="card">
          <h3>Prochain Examen</h3>
          <p>Module: Intelligence Artificielle</p>
          <p style={{ fontWeight: 'bold', color: 'var(--accent)' }}>Le 25 Mai 2024</p>
        </div>
      </div>
    </div>
  );
}
