/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif']
      },
      boxShadow: {
        card: '0 18px 50px rgba(24, 18, 48, 0.12)',
        float: '0 16px 40px rgba(18, 16, 40, 0.16)'
      }
    }
  },
  plugins: []
}
