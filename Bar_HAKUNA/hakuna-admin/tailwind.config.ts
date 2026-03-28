import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        admin: {
          primary: '#D4A847',
          dark: '#111827',
          sidebar: '#1F2937',
          card: '#1F2937',
          border: '#374151',
          success: '#10B981',
          danger: '#EF4444',
          warning: '#F59E0B',
        }
      }
    }
  },
  plugins: [],
}
export default config
