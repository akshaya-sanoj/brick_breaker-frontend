// src/components/AuthScreen.jsx
import { useState } from 'react';
import { loginUser, registerUser } from '../services/api';
import { GAME_NAME } from '../config/gameConfig';

export default function AuthScreen({ onLoginSuccess, theme, currentTheme }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLight = theme === 'light';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let response;
      if (isLogin) {
        response = await loginUser({ email: formData.email, password: formData.password });
      } else {
        response = await registerUser(formData);
      }
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLoginSuccess(response.data.user);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: '12px 15px',
    borderRadius: '8px',
    border: `1px solid ${isLight ? '#cbd5e1' : '#334155'}`,
    background: isLight ? '#f8fafc' : '#0f172a',
    color: isLight ? '#0f172a' : '#00E5FF',
    fontFamily: '"Orbitron", sans-serif',
    outline: 'none',
    boxShadow: isLight ? 'none' : 'inset 0 0 5px rgba(0,0,0,0.5)',
    transition: '0.3s'
  };

  return (
    <div style={{ 
      maxWidth: '400px', margin: '60px auto', padding: '40px 30px', 
      background: isLight ? '#ffffff' : '#1e293b', 
      borderRadius: '15px', 
      color: currentTheme?.textPrimary || '#fff',
      boxShadow: isLight ? '0 10px 30px rgba(0, 0, 0, 0.1)' : '0 0 20px rgba(0, 229, 255, 0.2), inset 0 0 20px rgba(0,0,0,0.5)',
      border: `1px solid ${isLight ? '#cbd5e1' : '#00E5FF'}`,
      transition: 'background 0.3s, color 0.3s, border 0.3s'
    }}>
      <h2 style={{ 
        textAlign: 'center', fontFamily: '"Orbitron", sans-serif', 
        color: '#00E5FF', textShadow: '0 0 10px rgba(0, 229, 255, 0.5)', 
        marginBottom: '30px', letterSpacing: '2px'
      }}>
        {GAME_NAME}
      </h2>
      
      {error && <div style={{ color: '#ff4757', marginBottom: '15px', textAlign: 'center', fontFamily: '"Orbitron", sans-serif', fontSize: '14px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {!isLogin && (
          <input 
            type="text" name="name" placeholder="PLAYER NAME" 
            value={formData.name} onChange={handleChange} required 
            style={inputStyle}
            onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0, 229, 255, 0.5)'}
            onBlur={(e) => e.target.style.boxShadow = isLight ? 'none' : 'inset 0 0 5px rgba(0,0,0,0.5)'}
          />
        )}
        <input 
          type="email" name="email" placeholder="EMAIL ADDRESS" 
          value={formData.email} onChange={handleChange} required 
          style={inputStyle}
          onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0, 229, 255, 0.5)'}
          onBlur={(e) => e.target.style.boxShadow = isLight ? 'none' : 'inset 0 0 5px rgba(0,0,0,0.5)'}
        />
        <input 
          type="password" name="password" placeholder="PASSWORD" 
          value={formData.password} onChange={handleChange} required 
          style={inputStyle}
          onFocus={(e) => e.target.style.boxShadow = '0 0 10px rgba(0, 229, 255, 0.5)'}
          onBlur={(e) => e.target.style.boxShadow = isLight ? 'none' : 'inset 0 0 5px rgba(0,0,0,0.5)'}
        />
        <button type="submit" disabled={loading} style={{ 
          padding: '15px', background: 'linear-gradient(90deg, #00E5FF, #0088ff)', 
          color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', 
          fontWeight: 'bold', fontFamily: '"Orbitron", sans-serif', fontSize: '16px',
          boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)', transition: '0.3s',
          opacity: loading ? 0.7 : 1
        }}>
          {loading ? 'INITIALIZING...' : (isLogin ? '▶ START SESSION' : '▶ CREATE ACCOUNT')}
        </button>
      </form>
      
      <p style={{ 
        textAlign: 'center', marginTop: '25px', cursor: 'pointer', 
        color: currentTheme?.textSecondary || '#94a3b8', fontFamily: '"Orbitron", sans-serif', fontSize: '12px',
        transition: '0.3s'
      }} 
      onClick={() => setIsLogin(!isLogin)}
      onMouseOver={(e) => e.target.style.color = '#00E5FF'}
      onMouseOut={(e) => e.target.style.color = currentTheme?.textSecondary || '#94a3b8'}
      >
        {isLogin ? "NEW PLAYER? REGISTER HERE" : "ALREADY REGISTERED? LOGIN"}
      </p>
    </div>
  );
}