/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        dark: '#0F172A',
        'dark-light': '#1E293B',
      },
    },
  },
  plugins: [],
}
