import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brasa': '#8B1A1A',
        'humo': '#1A1008',
        'madera': '#2D1F0D',
        'oro': '#D4A853',
        'crema': '#F5EFE6',
        'tierra': '#8B7355',
        'brasa-dark': '#6B1414',
        'brasa-light': '#A52020',
      },
      fontFamily: {
        'display': ['var(--font-playfair)', 'Georgia', 'serif'],
        'body': ['var(--font-lato)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scroll': 'scroll 2s ease-in-out infinite',
        'flicker': 'flicker 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        scroll: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(8px)', opacity: '0.4' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
          '75%': { opacity: '0.95' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(139, 26, 26, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(139, 26, 26, 0.8), 0 0 40px rgba(212, 168, 83, 0.3)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
