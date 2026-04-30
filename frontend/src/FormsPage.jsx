import React, { useState, useEffect } from 'react';

export default function FormsPage({ events, t }) {
  const [formData, setFormData] = useState({ name: '', major: '', form_type: 'certificate' });

  useEffect(() => {
    // Listen to AI form-filling intents
    const formIntents = events.filter(e => e.intent === 'fill_form');
    if (formIntents.length > 0) {
      const latestIntent = formIntents[formIntents.length - 1];
      if (latestIntent.fields) {
        setFormData(prev => ({
          ...prev,
          name: latestIntent.fields.name || prev.name,
          major: latestIntent.fields.major || prev.major,
          form_type: latestIntent.fields.form_type || prev.form_type
        }));
      }
    }
  }, [events]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted successfully! / تم إرسال الاستمارة بنجاح");
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h2>{t.forms_title}</h2>
        <p style={{ color: 'var(--text-muted)' }}>{t.forms_sub}</p>
      </div>

      <div className="dashboard-grid">
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>{t.forms_name}</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="Ex: Ahmed T." 
                required 
              />
            </div>
            <div className="form-group">
              <label>{t.forms_major}</label>
              <input 
                type="text" 
                value={formData.major} 
                onChange={e => setFormData({...formData, major: e.target.value})} 
                placeholder="Ex: L3 Informatique" 
                required 
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              {t.forms_submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}