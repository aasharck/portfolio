/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontSize: {
        'xxs': ['0.5rem', {
          lineHeight: '1rem',
        }],
      },
      animation: {
        wiggle: 'wiggle 0.2s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
    },
    screens:{
      sm: '480px',
      md: '768px',
      lg: '978px',
      xl: '1440px',
    }
  },
  plugins: [
  ],
};