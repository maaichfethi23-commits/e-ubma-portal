import React from 'react';

export default function Sidebar({ currentView, setCurrentView }) {
  const links = [
    { id: 'home', icon: '🏠', label: 'Accueil' },
    { id: 'vault', icon: '📁', label: 'E-UBMA Vault' },
    { id: 'badges', icon: '🏆', label: 'Open Badges' },
  ];

  return (
    <nav className="sidebar">
      <div className="brand">
        <h1>E-UBMA Portal</h1>
      </div>
      
      <div className="nav-links">
        {links.map(link => (
          <div 
            key={link.id}
            className={`nav-item ${currentView === link.id ? 'active' : ''}`}
            onClick={() => setCurrentView(link.id)}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </div>
        ))}
      </div>
      
      <div className="user-profile">
        <div className="avatar">A</div>
        <div>
          <div style={{ fontWeight: 600 }}>Ahmed T.</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>L3 Informatique</div>
        </div>
      </div>
    </nav>
  );
}
