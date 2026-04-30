import React, { useState } from 'react';

export default function Login({ onLogin, lang, setLang, t }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', first_name: '', last_name: '', major: 'L3 Informatique'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/register' : '/api/login';
      const body = isRegister ? formData : { email: formData.email, password: formData.password };
      
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || "Authentication Failed");
      }

      // Save user info globally or locally if needed
      localStorage.setItem("user_id", data.user_id);
      onLogin(); // Update parent state to authenticated
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-container ${lang === 'ar' ? 'rtl' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <button 
        onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
        style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: '1px solid var(--border-color)', color: 'white', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}
      >
        🌍 {lang === 'fr' ? 'AR' : 'FR'}
      </button>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">E-UBMA</div>
          <h2>{isRegister ? (lang === 'ar' ? "حساب جديد" : "Créer un compte") : t.login_welcome}</h2>
          <p>{t.login_sub}</p>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          
          {isRegister && (
            <>
              <div className="form-group">
                <label>{lang === 'ar' ? "الاسم" : "Prénom"}</label>
                <input type="text" required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>{lang === 'ar' ? "اللقب" : "Nom"}</label>
                <input type="text" required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
              </div>
            </>
          )}

          <div className="form-group">
            <label>{t.login_email}</label>
            <input 
              type="text" 
              placeholder="Ex: a.taleb@univ-annaba.dz" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className="form-group">
            <label>{t.login_pass}</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "..." : (isRegister ? (lang === 'ar' ? "تسجيل" : "S'inscrire") : t.login_btn)}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', cursor: 'pointer', color: 'var(--accent)' }} onClick={() => setIsRegister(!isRegister)}>
          {isRegister 
            ? (lang === 'ar' ? "لديك حساب؟ ادخل هنا" : "Déjà un compte ? Connectez-vous") 
            : (lang === 'ar' ? "إنشاء حساب جديد" : "Créer un nouveau compte")}
        </p>
      </div>
    </div>
  );
}