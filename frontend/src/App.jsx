import { useState } from 'react';
import Sidebar from './Sidebar';
import Home from './Home';
import VaultPage from './VaultPage';
import BadgesPage from './BadgesPage';
import FloatingChatbot from './FloatingChatbot';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [dashboardEvents, setDashboardEvents] = useState([]);

  const handleIntentDetected = (intentData) => {
    setDashboardEvents(prev => [...prev, intentData]);
    // Optionally switch view based on intent
    if (intentData.intent === 'request_document') setCurrentView('vault');
    if (intentData.intent === 'validate_badge') setCurrentView('badges');
    if (intentData.intent === 'navigate') setCurrentView(intentData.destination);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home': return <Home />;
      case 'vault': return <VaultPage events={dashboardEvents} />;
      case 'badges': return <BadgesPage events={dashboardEvents} />;
      default: return <Home />;
    }
  };

  return (
    <div className="portal-layout">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="main-area">
        {renderContent()}
      </main>

      <FloatingChatbot onIntentDetected={handleIntentDetected} />
    </div>
  );
}

export default App;
