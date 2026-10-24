// src/App.jsx
import { useState, useEffect } from 'react';
import { GAME_NAME } from './config/gameConfig';
import LandingPage from './components/LandingPage';
import AuthScreen from './components/AuthScreen';
import GameCanvas from './components/GameCanvas';
import Leaderboard from './components/Leaderboard';
import Shop from './components/Shop';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('GAME'); // 'GAME', 'LEADERBOARD', or 'SHOP'
  const [showLanding, setShowLanding] = useState(true);
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'

  // Theme configuration palettes
  const themes = {
    dark: {
      background: 'radial-gradient(circle at top, #1e293b 0%, #020617 100%)',
      cardBg: 'rgba(30, 41, 59, 0.5)',
      borderColor: '#334155',
      textPrimary: '#ffffff',
      textSecondary: '#94a3b8',
    },
    light: {
      background: 'radial-gradient(circle at top, #f8fafc 0%, #e2e8f0 100%)',
      cardBg: 'rgba(255, 255, 255, 0.8)',
      borderColor: '#cbd5e1',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
    }
  };

  const currentTheme = themes[theme];

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.title = GAME_NAME;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setShowLanding(false);
    }
  }, []);

  const handleLoginSuccess = (authData) => {
    const loggedInUser = authData.user || authData;
    const token = authData.token;

    if (token) {
      localStorage.setItem('token', token);
    }
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    
    setUser(loggedInUser);
    setCurrentView('GAME');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowLanding(true);
  };

  return (
    <div style={{ 
      textAlign: 'center', 
      minHeight: '100vh', 
      background: currentTheme.background, 
      color: currentTheme.textPrimary, 
      padding: '40px 20px',
      fontFamily: '"Orbitron", sans-serif',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>
      
      {!user ? (
        showLanding ? (
          <LandingPage onEnter={() => setShowLanding(false)} theme={theme} currentTheme={currentTheme} toggleTheme={toggleTheme} />
        ) : (
          <AuthScreen onLoginSuccess={handleLoginSuccess} theme={theme} currentTheme={currentTheme} toggleTheme={toggleTheme} />
        )
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
          
          {/* Top Navigation Bar */}
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            background: currentTheme.cardBg, padding: '15px 25px', 
            borderRadius: '12px', marginBottom: '30px', border: `1px solid ${currentTheme.borderColor}`,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: currentTheme.textSecondary, fontSize: '14px' }}>PLAYER_ID:</span>
              <span style={{ color: '#00E5FF', fontWeight: 'bold', letterSpacing: '1px' }}>{user.name}</span>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button 
                onClick={() => setCurrentView('GAME')}
                style={{ 
                  background: currentView === 'GAME' ? 'rgba(0, 229, 255, 0.2)' : 'transparent', 
                  color: '#00E5FF', border: '1px solid #00E5FF', borderRadius: '6px', 
                  padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold',
                  fontFamily: '"Orbitron", sans-serif', transition: '0.3s'
                }}
              >
                🎮 GAME
              </button>

              <button 
                onClick={() => setCurrentView('SHOP')}
                style={{ 
                  background: currentView === 'SHOP' ? 'rgba(255, 215, 0, 0.2)' : 'transparent', 
                  color: '#ffd700', border: '1px solid #ffd700', borderRadius: '6px', 
                  padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold',
                  fontFamily: '"Orbitron", sans-serif', transition: '0.3s'
                }}
              >
                🟡 SHOP
              </button>

              <button 
                onClick={() => setCurrentView('LEADERBOARD')}
                style={{ 
                  background: currentView === 'LEADERBOARD' ? 'rgba(46, 213, 115, 0.2)' : 'transparent', 
                  color: '#2ed573', border: '1px solid #2ed573', borderRadius: '6px', 
                  padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold',
                  fontFamily: '"Orbitron", sans-serif', transition: '0.3s'
                }}
              >
                🏆 RANKS
              </button>

              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme}
                style={{ 
                  background: 'transparent', color: currentTheme.textPrimary, 
                  border: `1px solid ${currentTheme.borderColor}`, borderRadius: '6px', 
                  padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold',
                  fontFamily: '"Orbitron", sans-serif', transition: '0.3s'
                }}
              >
                {theme === 'dark' ? '☀️ LIGHT' : '🌙 DARK'}
              </button>

              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'transparent', color: '#ff4757', 
                  border: '1px solid #ff4757', borderRadius: '6px', 
                  padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold',
                  fontFamily: '"Orbitron", sans-serif', transition: '0.3s'
                }}
              >
                LOGOUT
              </button>
            </div>
          </div>
          
          {/* Main Content Area with Theme Props Passed Down */}
          <div>
            {currentView === 'GAME' && <GameCanvas setUser={setUser} theme={theme} currentTheme={currentTheme} />}            
            {currentView === 'LEADERBOARD' && <Leaderboard theme={theme} currentTheme={currentTheme} />}
            {currentView === 'SHOP' && <Shop user={user} setUser={setUser} theme={theme} currentTheme={currentTheme} />}
          </div>

        </div>
      )}
      
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default App;