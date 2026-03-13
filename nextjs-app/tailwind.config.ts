import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#060D1F',
        'bg-alt': '#0A1628',
        cyan:     '#00D4FF',
        green:    '#00FF88',
        blue:     '#0066FF',
      },
      fontFamily: {
        sans:  ['Inter', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)',
        'gradient-blue':  'linear-gradient(135deg, #0066FF 0%, #00D4FF 100%)',
      },
    },
  },
  plugins: [],
}

export default config
