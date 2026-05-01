import { useState } from 'react';
import Sidebar from './Sidebar';
import Home from './Home';
import VaultPage from './VaultPage';
import BadgesPage from './BadgesPage';
import FormsPage from './FormsPage';
import FloatingChatbot from './FloatingChatbot';
import Login from './Login';
import { translations } from './translations';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [dashboardEvents, setDashboardEvents] = useState([]);
  const [lang, setLang] = useState('fr');

  const t = translations[lang];

  const handleIntentDetected = (intentData) => {
    setDashboardEvents(prev => [...prev, intentData]);
    if (intentData.intent === 'request_document') setCurrentView('vault');
    if (intentData.intent === 'validate_badge') setCurrentView('badges');
    if (intentData.intent === 'navigate') setCurrentView(intentData.destination);
    if (intentData.intent === 'fill_form') setCurrentView('forms');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home': return <Home t={t} />;
      case 'vault': return <VaultPage events={dashboardEvents} t={t} />;
      case 'badges': return <BadgesPage events={dashboardEvents} t={t} />;
      case 'forms': return <FormsPage events={dashboardEvents} t={t} />;
      default: return <Home t={t} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} lang={lang} setLang={setLang} t={t} />;
  }

  return (
    <div className={`portal-layout ${lang === 'ar' ? 'rtl' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} lang={lang} setLang={setLang} t={t} />

      <main className="main-area">
        {renderContent()}
      </main>

      <FloatingChatbot
        onIntentDetected={handleIntentDetected}
        lang={lang}
        t={t}
      />
    </div>
  );
}

export default App;
