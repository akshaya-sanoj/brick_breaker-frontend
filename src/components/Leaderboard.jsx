// src/components/Leaderboard.jsx
import { useEffect, useState } from 'react';
import { getLeaderboard } from '../services/api';
import { GAME_NAME } from '../config/gameConfig';

export default function Leaderboard({ theme, currentTheme }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await getLeaderboard();
        setLeaders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load leaderboard data.');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

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

  if (loading) return <div style={{ color: '#00E5FF', fontFamily: '"Orbitron", sans-serif' }}>Loading Leaderboard...</div>;
  if (error) return <div style={{ color: '#ff4757', fontFamily: '"Orbitron", sans-serif' }}>{error}</div>;

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#00E5FF', fontFamily: '"Orbitron", sans-serif', textShadow: '0 0 10px rgba(0, 229, 255, 0.5)', letterSpacing: '2px' }}>
        {GAME_NAME} TOP 10
      </h2>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '25px', fontFamily: '"Orbitron", sans-serif' }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${theme === 'light' ? '#cbd5e1' : '#00E5FF'}`, textAlign: 'left', color: currentTheme?.textSecondary || '#94a3b8' }}>
            <th style={{ padding: '15px 10px' }}>Rank</th>
            <th style={{ padding: '15px 10px' }}>Player</th>
            <th style={{ padding: '15px 10px' }}>Highest Score</th>
            <th style={{ padding: '15px 10px' }}>Bricks</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((player, index) => (
            <tr key={player._id} style={{ borderBottom: `1px solid ${theme === 'light' ? '#e2e8f0' : '#334155'}`, transition: '0.3s', backgroundColor: index % 2 === 0 ? 'transparent' : (theme === 'light' ? '#f8fafc' : 'rgba(255,255,255,0.02)') }}>
              <td style={{ padding: '15px 10px', fontSize: '1.2rem' }}>
                {index === 0 ? '🏆 1' : index === 1 ? '🥈 2' : index === 2 ? '🥉 3' : index + 1}
              </td>
              <td style={{ padding: '15px 10px', fontWeight: 'bold', letterSpacing: '1px' }}>{player.name}</td>
              <td style={{ padding: '15px 10px', color: '#2ed573', fontWeight: 'bold', textShadow: '0 0 8px rgba(46, 213, 115, 0.4)' }}>
                {player.highestScore}
              </td>
              <td style={{ padding: '15px 10px', color: currentTheme?.textSecondary || '#cbd5e1' }}>{player.totalBricksDestroyed}</td>
            </tr>
          ))}
          {leaders.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: currentTheme?.textSecondary || '#94a3b8' }}>No scores yet. Be the first to conquer the quest!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}