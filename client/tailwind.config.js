/**
 * Design system: "Ink & Champagne"
 * A warm, editorial theme for the wedding invitation.
 *
 * Palette:
 *  - ink   : warm near-black neutrals (backgrounds, text, hairlines)
 *  - gold  : champagne accents (primary action, highlights)
 *  - clay  : terracotta rose (secondary accent, status)
 *
 * Legacy aliases: existing markup still references `sky-*` (accent) and
 * `slate-*` (ink). Those keys are remapped below so the whole app inherits
 * the new palette. New markup should prefer `gold-*` / `ink-*`.
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    screens: {
      'xs': '380px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        ink: {
          50: '#FAF6F0',
          100: '#F3EDE4',
          200: '#E7DDD0',
          300: '#D3C5B4',
          400: '#B0A08D',
          500: '#8C7B68',
          600: '#6B5C4B',
          700: '#4C4136',
          800: '#2E2721',
          900: '#1A1613',
          950: '#0C0A08',
        },
        gold: {
          50: '#FBF5E9',
          100: '#F6EAD0',
          200: '#EED6A4',
          300: '#E3C07A',
          400: '#D8AB55',
          500: '#C8913A',
          600: '#A9742B',
          700: '#855823',
          800: '#5F3F1C',
          900: '#3B2814',
        },
        clay: {
          200: '#F0CCC4',
          300: '#E0A79A',
          400: '#D08C7C',
          500: '#B9705F',
          600: '#9A5546',
        },

        /* Legacy aliases -------------------------------------------------- */
        sky: {
          50: '#FBF5E9',
          100: '#F6EAD0',
          200: '#EED6A4',
          300: '#E3C07A',
          400: '#D8AB55',
          500: '#C8913A',
          600: '#A9742B',
          700: '#855823',
          800: '#5F3F1C',
          900: '#3B2814',
        },
        slate: {
          50: '#FAF6F0',
          100: '#F3EDE4',
          200: '#E7DDD0',
          300: '#D3C5B4',
          400: '#B0A08D',
          500: '#8C7B68',
          600: '#6B5C4B',
          700: '#4C4136',
          800: '#2E2721',
          900: '#1A1613',
          950: '#0C0A08',
        },
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', '1.1rem'],
        'sm': ['0.875rem', '1.4rem'],
        'base': ['1rem', '1.65rem'],
        'lg': ['1.0625rem', '1.7rem'],
        'xl': ['1.25rem', '1.8rem'],
        '2xl': ['1.5rem', '2rem'],
        '3xl': ['1.875rem', '2.3rem'],
        '4xl': ['2.25rem', '2.6rem'],
        '5xl': ['3rem', '1.05'],
        '6xl': ['3.75rem', '1.02'],
        '7xl': ['4.5rem', '1'],
        '8xl': ['6rem', '0.95'],
        '9xl': ['7.5rem', '0.88'],
      },
      letterSpacing: {
        'label': '0.28em',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      boxShadow: {
        'lift': '0 1.5rem 3.5rem -1.5rem rgba(0, 0, 0, 0.65)',
        'glow-gold': '0 0 0 1px rgba(227, 192, 122, 0.28), 0 1.25rem 4rem -1rem rgba(200, 145, 58, 0.35)',
      },
      transitionTimingFunction: {
        'swift': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'exit': 'cubic-bezier(0.4, 0, 1, 1)',
      },
      animation: {
        'marquee': 'marquee 42s linear infinite',
        'drift-slow': 'drift 26s ease-in-out infinite alternate',
        'drift-slower': 'drift 38s ease-in-out infinite alternate-reverse',
        'sheen': 'sheen 6s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'hairline-draw': 'hairline-draw 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        },
        drift: {
          '0%': { transform: 'translate3d(-2%, -1%, 0) scale(1)' },
          '100%': { transform: 'translate3d(3%, 2%, 0) scale(1.08)' },
        },
        sheen: {
          '0%': { transform: 'translateX(-120%) skewX(-12deg)' },
          '55%, 100%': { transform: 'translateX(220%) skewX(-12deg)' },
        },
        'hairline-draw': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
}
