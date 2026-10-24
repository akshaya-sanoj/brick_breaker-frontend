// src/components/Shop.jsx
import { useState } from 'react';
import { buySkin } from '../services/api';

export default function Shop({ user, setUser, theme, currentTheme }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const skins = [
    { name: 'CYAN DEFAULT', color: '#00E5FF', cost: 0 },
    { name: 'NEON PINK', color: '#ff2a85', cost: 50 },
    { name: 'PLASMA GREEN', color: '#39ff14', cost: 100 },
    { name: 'GOLDEN FURY', color: '#ffd700', cost: 250 }
  ];

  const handleBuy = async (skin) => {
    setMessage('');
    setLoading(true);
    try {
      const res = await buySkin({ skinColor: skin.color, cost: skin.cost });
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setMessage(`Successfully unlocked ${skin.name}!`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    background: theme === 'light' ? '#ffffff' : 'rgba(30, 41, 59, 0.7)',
    padding: '30px',
    borderRadius: '15px',
    color: theme === 'light' ? '#0f172a' : '#fff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    border: `1px solid ${theme === 'light' ? '#cbd5e1' : '#334155'}`,
    transition: 'background 0.3s, color 0.3s'
  };

  const itemBoxStyle = (skinColor) => ({
    background: theme === 'light' ? '#f8fafc' : '#0f172a',
    padding: '20px',
    borderRadius: '10px',
    border: `1px solid ${skinColor}`,
    textAlign: 'center',
    boxShadow: `inset 0 0 10px ${skinColor}33`,
    transition: 'background 0.3s'
  });

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#ffd700', fontFamily: '"Orbitron", sans-serif', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)', letterSpacing: '2px', marginBottom: '10px' }}>
        ARCADE SHOP
      </h2>
      <div style={{ textAlign: 'center', marginBottom: '25px', fontSize: '1.2rem', fontFamily: '"Orbitron", sans-serif', color: currentTheme?.textPrimary || (theme === 'light' ? '#0f172a' : '#fff') }}>
        YOUR COINS: <span style={{ color: '#ffd700', fontWeight: 'bold' }}>🟡 {user?.coins || 0}</span>
      </div>

      {message && <div style={{ textAlign: 'center', marginBottom: '15px', color: message.includes('failed') || message.includes('enough') ? '#ff4757' : '#2ed573', fontFamily: '"Orbitron", sans-serif' }}>{message}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {skins.map((skin) => {
          const isUnlocked = user?.unlockedSkins?.includes(skin.color) || (skin.cost === 0 && !user?.unlockedSkins);
          const canAfford = (user?.coins || 0) >= skin.cost;

          return (
            <div key={skin.color} style={itemBoxStyle(skin.color)}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: skin.color, margin: '0 auto 15px auto', boxShadow: `0 0 15px ${skin.color}` }}></div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontFamily: '"Orbitron", sans-serif', color: skin.color }}>{skin.name}</h3>
              
              {isUnlocked ? (
                <button disabled style={{ width: '100%', padding: '10px', background: theme === 'light' ? '#e2e8f0' : '#334155', color: theme === 'light' ? '#64748b' : '#94a3b8', border: 'none', borderRadius: '6px', fontFamily: '"Orbitron", sans-serif' }}>UNLOCKED</button>
              ) : (
                <button 
                  onClick={() => handleBuy(skin)}
                  disabled={!canAfford || loading}
                  style={{ width: '100%', padding: '10px', background: canAfford ? skin.color : (theme === 'light' ? '#e2e8f0' : '#334155'), color: canAfford ? '#000' : (theme === 'light' ? '#94a3b8' : '#64748b'), border: 'none', borderRadius: '6px', cursor: canAfford ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontFamily: '"Orbitron", sans-serif' }}
                >
                  🟡 {skin.cost} COINS
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}