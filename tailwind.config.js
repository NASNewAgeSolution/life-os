/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
      },
      colors: {
        bg: '#080810',
        work: '#60a5fa',
        health: '#34d399',
        finance: '#fbbf24',
        family: '#c084fc',
        education: '#22d3ee',
        business: '#fb923c',
      },
    },
  },
  plugins: [],
}
