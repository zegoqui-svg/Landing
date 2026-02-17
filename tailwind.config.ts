/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1A3C34', // Deeper green
          primary: '#2D4F49', // Original dark
          muted: '#7A9D96',
          warm: '#C5A88B', // Gold/Sand accent
          light: '#F8F6F4', // Warm off-white
          white: '#FFFFFF',
          gold: '#D4AF37', // Premium gold
        },
        siluel: {
          sand: '#E8DCC4',
          terracotta: '#C17767',
          sage: '#7D8A74',
          dark: '#3D3D3D',
          cream: '#FAF8F5',
          earth: '#8B7355',
        }
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'serif'],
      },
    },
  },
  plugins: [],
}