import React from 'react';

export default function VaultPage({ events, t }) {
  const documents = events.filter(e => e.intent === 'request_document');

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>E-UBMA Vault 🔐</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          {t?.vault_sub || 'Vos documents signés électroniquement (PAdES).'}
        </p>
      </div>

      <div className="dashboard-grid">
        {documents.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</div>
            <p style={{ color: 'var(--text-muted)' }}>
              {t?.vault_empty || "Aucun document. Utilisez l'assistant AI pour en demander un!"}
            </p>
          </div>
        ) : (
          documents.map((doc, idx) => (
            <div key={idx} className="card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📄</div>
              <h3>{doc.document_type || 'Relevé de notes'}</h3>
              <p style={{ color: 'var(--text-muted)' }}>Signé numériquement par l'Université.</p>
              <button className="btn-primary">Télécharger PDF</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
