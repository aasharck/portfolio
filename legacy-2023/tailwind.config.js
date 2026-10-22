/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:        '#070707',
        'bg-card': '#0D0D0D',
        ink:       '#E8E3D8',
        'ink-2':   '#6E6C67',
        'ink-3':   '#282724',
        accent:    '#C9A96E',
      },
      fontSize: {
        'xxs': ['0.5rem', { lineHeight: '1rem' }],
      },
      animation: {
        'slide-up': 'slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-up':  'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(105%)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
    screens: {
      sm:  '480px',
      md:  '768px',
      lg:  '978px',
      xl:  '1440px',
    },
  },
  plugins: [],
};
