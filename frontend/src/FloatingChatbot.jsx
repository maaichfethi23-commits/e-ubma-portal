import { useState, useRef, useEffect } from 'react';

export default function FloatingChatbot({ apiUrl = 'http://localhost:8000/api/chat', onIntentDetected, lang, t }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Bonjour! Je suis l\'assistant AI E-UBMA. / أهلاً بك! أنا المساعد الذكي E-UBMA.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Mock Context (In a real app, this would come from a Context/Redux store)
      const userContext = {
        name: "Ahmed T.",
        major: "L3 Informatique",
        grades: { "IA": 15.5, "Reseaux": 12.0, "Compilation": 14.0 },
        current_page: window.location.pathname,
        ui_language: lang
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage, 
          user_id: 'student_ui',
          context: userContext
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
      
      if (data.intent_detected && onIntentDetected) {
        onIntentDetected(data.intent_detected);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Erreur de connexion au serveur. / خطأ في الاتصال.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        className="floating-widget-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="floating-chat-window" dir="auto">
          <div className="chat-header">
            <h3>Assistant E-UBMA ✨</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-history">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`} dir="auto">
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <span className="loader"></span>
                <span className="loader"></span>
                <span className="loader"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSend} className="chat-input-area" dir="auto">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: أريد كشف النقاط..."
              className="chat-input"
              disabled={isLoading}
            />
            <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
              Envoyer
            </button>
          </form>
        </div>
      )}
    </>
  );
}