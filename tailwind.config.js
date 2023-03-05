/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
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