export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1a1a1a',
        'secondary': '#2d2d2d',
        'accent': '#00d4ff',
        'success': '#10b981',
        'danger': '#ef4444',
        'warning': '#f59e0b',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'lg': '0.75rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
