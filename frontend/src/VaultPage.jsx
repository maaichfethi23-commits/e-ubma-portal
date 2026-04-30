import React from 'react';

export default function VaultPage({ events }) {
  const documents = events.filter(e => e.intent === 'request_document');

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>E-UBMA Vault</h2>
        <p style={{ color: 'var(--text-muted)' }}>Vos documents signés électroniquement (PAdES).</p>
      </div>

      <div className="dashboard-grid">
        {documents.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
             <p style={{ color: 'var(--text-muted)' }}>Aucun document. Utilisez l'assistant AI pour en demander un!</p>
          </div>
        ) : (
          documents.map((doc, idx) => (
            <div key={idx} className="card">
              <h3>{doc.document_type || 'Relevé de notes (كشف النقاط)'}</h3>
              <p>Signé numériquement par l'Université.</p>
              <button className="btn-primary">Télécharger PDF</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
