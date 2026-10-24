// src/components/LandingPage.jsx
import { GAME_NAME } from '../config/gameConfig';

export default function LandingPage({ onEnter, theme, currentTheme, toggleTheme }) {
  const isLight = theme === 'light';

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '85vh', fontFamily: '"Orbitron", sans-serif', animation: 'fadeIn 0.8s ease-in-out'
    }}>
      
      {/* Hero Section Container */}
      <div style={{
        position: 'relative',
        background: isLight ? '#ffffff' : 'rgba(30, 41, 59, 0.7)',
        padding: '50px 40px 40px 40px',
        borderRadius: '20px',
        border: `1px solid ${isLight ? '#cbd5e1' : '#00E5FF'}`,
        boxShadow: isLight ? '0 10px 30px rgba(0, 0, 0, 0.08)' : '0 0 30px rgba(0, 229, 255, 0.2), inset 0 0 20px rgba(0,0,0,0.5)',
        textAlign: 'center',
        maxWidth: '700px',
        width: '100%',
        backdropFilter: 'blur(10px)',
        transition: 'background 0.3s, border 0.3s, boxShadow 0.3s'
      }}>
        
        {/* Integrated Top-Right Theme Toggle */}
        <button 
          onClick={toggleTheme}
          style={{ 
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: isLight ? '#f1f5f9' : 'rgba(15, 23, 42, 0.6)', 
            color: currentTheme?.textPrimary || '#fff', 
            border: `1px solid ${isLight ? '#cbd5e1' : '#334155'}`, 
            borderRadius: '6px', 
            padding: '6px 12px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: '11px',
            fontFamily: '"Orbitron", sans-serif', 
            transition: '0.3s'
          }}
        >
          {theme === 'dark' ? '☀️ LIGHT' : '🌙 DARK'}
        </button>

        <h1 style={{ 
          fontSize: '2.8rem', margin: '10px 0 10px 0', color: '#00E5FF',
          textShadow: '0 0 15px rgba(0, 229, 255, 0.6)', letterSpacing: '3px'
        }}>
          {GAME_NAME}
        </h1>
        
        <p style={{ color: isLight ? '#475569' : '#94a3b8', fontSize: '1.1rem', marginBottom: '35px', letterSpacing: '1px' }}>
          A Next-Generation Full-Stack Arcade Experience
        </p>

        {/* Feature Grid */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '20px', marginBottom: '35px', textAlign: 'left'
        }}>
          <div style={{ background: isLight ? '#f8fafc' : '#0f172a', padding: '20px', borderRadius: '12px', border: `1px solid ${isLight ? '#cbd5e1' : '#334155'}`, transition: 'background 0.3s' }}>
            <div style={{ fontSize: '22px', marginBottom: '10px' }}>🚀</div>
            <h3 style={{ color: isLight ? '#0f172a' : '#fff', margin: '0 0 5px 0', fontSize: '0.95rem' }}>Advanced Physics</h3>
            <p style={{ color: isLight ? '#475569' : '#64748b', margin: 0, fontSize: '0.8rem', fontFamily: 'sans-serif' }}>
              Realistic multi-ball trajectory and dynamic collision mechanics.
            </p>
          </div>
          
          <div style={{ background: isLight ? '#f8fafc' : '#0f172a', padding: '20px', borderRadius: '12px', border: `1px solid ${isLight ? '#cbd5e1' : '#334155'}`, transition: 'background 0.3s' }}>
            <div style={{ fontSize: '22px', marginBottom: '10px' }}>⚡</div>
            <h3 style={{ color: isLight ? '#0f172a' : '#fff', margin: '0 0 5px 0', fontSize: '0.95rem' }}>Neon Power-Ups</h3>
            <p style={{ color: isLight ? '#475569' : '#64748b', margin: 0, fontSize: '0.8rem', fontFamily: 'sans-serif' }}>
              Destroy glowing orbs to expand arsenal and multiply destructive power.
            </p>
          </div>

          <div style={{ background: isLight ? '#f8fafc' : '#0f172a', padding: '20px', borderRadius: '12px', border: `1px solid ${isLight ? '#cbd5e1' : '#334155'}`, transition: 'background 0.3s' }}>
            <div style={{ fontSize: '22px', marginBottom: '10px' }}>🏆</div>
            <h3 style={{ color: isLight ? '#0f172a' : '#fff', margin: '0 0 5px 0', fontSize: '0.95rem' }}>Global Ranks</h3>
            <p style={{ color: isLight ? '#475569' : '#64748b', margin: 0, fontSize: '0.8rem', fontFamily: 'sans-serif' }}>
              Compete against other players in real-time via MongoDB Atlas.
            </p>
          </div>
        </div>

        {/* Call to Action Button */}
        <button 
          onClick={onEnter}
          style={{ 
            padding: '16px 35px', fontSize: '1.1rem', fontWeight: 'bold',
            background: 'linear-gradient(90deg, #00E5FF, #0088ff)', color: '#000',
            border: 'none', borderRadius: '10px', cursor: 'pointer',
            fontFamily: '"Orbitron", sans-serif', letterSpacing: '2px',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)', transition: '0.3s'
          }}
          onMouseOver={(e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.8)'; }}
          onMouseOut={(e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.5)'; }}
        >
          ENTER THE ARCADE
        </button>
      </div>
    </div>
  );
}