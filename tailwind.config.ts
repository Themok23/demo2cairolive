import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/presentation/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',
        surface: '#FFFFFF',
        primary: '#E8572A',
        secondary: '#1A1A2E',
        'accent-gold': '#F5C542',
        'accent-green': '#4CAF88',
        muted: '#E8E8E4',
        'text-primary': '#1A1A2E',
        'text-muted': '#6B6B7B',
      },
      fontFamily: {
        display: ['DM Serif Display', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        input: '12px',
        button: '8px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08), 0 12px 48px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
