import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(null);

const themes = {
  retro: {
    name: 'Retro Orange',
    colors: {
      '--color-primary': '#E8871E',
      '--color-primary-light': '#F5A623',
      '--color-primary-dark': '#C96D0A',
      '--color-secondary': '#2D2D2D',
      '--color-secondary-light': '#4A4A4A',
      '--color-secondary-dark': '#1A1A1A',
      '--color-accent': '#E8871E',
      '--color-accent-hover': '#D4780F',
      '--color-background': '#F5EDE3',
      '--color-background-secondary': '#EDE4D8',
      '--color-background-tertiary': '#E5DACB',
      '--color-text-primary': '#2D2D2D',
      '--color-text-secondary': '#4A4A4A',
      '--color-text-muted': '#8B8B8B',
      '--color-card': '#FFF8F0',
      '--color-card-hover': '#FFF0E0',
      '--color-border': '#2D2D2D',
      '--color-border-accent': '#E8871E',
      '--color-danger': '#E84040',
      '--color-success': '#4CAF50',
      '--color-surface': '#FFFAF5',
    },
  },
  retroDark: {
    name: 'Retro Dark',
    colors: {
      '--color-primary': '#E8871E',
      '--color-primary-light': '#F5A623',
      '--color-primary-dark': '#C96D0A',
      '--color-secondary': '#1A1A1A',
      '--color-secondary-light': '#2D2D2D',
      '--color-secondary-dark': '#0D0D0D',
      '--color-accent': '#E8871E',
      '--color-accent-hover': '#D4780F',
      '--color-background': '#1E1E1E',
      '--color-background-secondary': '#2A2A2A',
      '--color-background-tertiary': '#333333',
      '--color-text-primary': '#F5EDE3',
      '--color-text-secondary': '#D4C8B8',
      '--color-text-muted': '#8B8B8B',
      '--color-card': '#2D2D2D',
      '--color-card-hover': '#3A3A3A',
      '--color-border': '#E8871E',
      '--color-border-accent': '#E8871E',
      '--color-danger': '#E84040',
      '--color-success': '#4CAF50',
      '--color-surface': '#252525',
    },
  },
  retroMint: {
    name: 'Retro Mint',
    colors: {
      '--color-primary': '#2EAD8E',
      '--color-primary-light': '#45C9A8',
      '--color-primary-dark': '#1D8A6F',
      '--color-secondary': '#2D3B36',
      '--color-secondary-light': '#3D4F48',
      '--color-secondary-dark': '#1A2420',
      '--color-accent': '#2EAD8E',
      '--color-accent-hover': '#1D8A6F',
      '--color-background': '#F0F5F3',
      '--color-background-secondary': '#E3EDE8',
      '--color-background-tertiary': '#D5E0DA',
      '--color-text-primary': '#2D3B36',
      '--color-text-secondary': '#4A5C55',
      '--color-text-muted': '#7A8E86',
      '--color-card': '#FAFCFB',
      '--color-card-hover': '#EFF5F2',
      '--color-border': '#2D3B36',
      '--color-border-accent': '#2EAD8E',
      '--color-danger': '#E84040',
      '--color-success': '#2EAD8E',
      '--color-surface': '#F7FAF8',
    },
  },
  retroPurple: {
    name: 'Retro Purple',
    colors: {
      '--color-primary': '#8B5CF6',
      '--color-primary-light': '#A78BFA',
      '--color-primary-dark': '#7C3AED',
      '--color-secondary': '#2D2640',
      '--color-secondary-light': '#3D3455',
      '--color-secondary-dark': '#1A162B',
      '--color-accent': '#8B5CF6',
      '--color-accent-hover': '#7C3AED',
      '--color-background': '#F5F0FA',
      '--color-background-secondary': '#EDE5F5',
      '--color-background-tertiary': '#E0D4ED',
      '--color-text-primary': '#2D2640',
      '--color-text-secondary': '#4A4060',
      '--color-text-muted': '#8B80A0',
      '--color-card': '#FFFBFF',
      '--color-card-hover': '#F5EEFA',
      '--color-border': '#2D2640',
      '--color-border-accent': '#8B5CF6',
      '--color-danger': '#E84040',
      '--color-success': '#4CAF50',
      '--color-surface': '#FAF8FC',
    },
  },
  retroRose: {
    name: 'Retro Rose',
    colors: {
      '--color-primary': '#E05080',
      '--color-primary-light': '#F06898',
      '--color-primary-dark': '#C83868',
      '--color-secondary': '#3D2030',
      '--color-secondary-light': '#552D42',
      '--color-secondary-dark': '#2A1520',
      '--color-accent': '#E05080',
      '--color-accent-hover': '#C83868',
      '--color-background': '#FDF0F4',
      '--color-background-secondary': '#F5E0E8',
      '--color-background-tertiary': '#EDD0DC',
      '--color-text-primary': '#3D2030',
      '--color-text-secondary': '#5C3548',
      '--color-text-muted': '#9A7888',
      '--color-card': '#FFFAFC',
      '--color-card-hover': '#FFF0F5',
      '--color-border': '#3D2030',
      '--color-border-accent': '#E05080',
      '--color-danger': '#E84040',
      '--color-success': '#4CAF50',
      '--color-surface': '#FEF8FA',
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'retro';
  });

  useEffect(() => {
    const theme = themes[currentTheme];
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const value = {
    currentTheme,
    themes: Object.keys(themes),
    themeNames: Object.entries(themes).map(([key, value]) => ({
      key,
      name: value.name,
    })),
    changeTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
