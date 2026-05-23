export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#ffffff',
        accent: '#ffd700',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        sparkle: 'sparkle 2s ease-in-out infinite',
        fadeIn: 'fadeIn 1s ease-in-out',
        slideIn: 'slideIn 0.8s ease-out',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
