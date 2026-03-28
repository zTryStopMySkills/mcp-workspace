import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        hakuna: {
          gold: '#D4A847',
          dark: '#1a1a1a',
          brown: '#2d1b0e',
          cream: '#f5f0e8',
          red: '#8B2500',
        }
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

export default config
