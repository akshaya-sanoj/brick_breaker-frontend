// Add theme state to your existing App.jsx states:
const [theme, setTheme] = useState('dark'); // 'dark' or 'light'

// Toggle function:
const toggleTheme = () => {
  setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
};

// Define theme color palettes:
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