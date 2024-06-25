module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Open Sans', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'sans': ['Montserrat', 'Arial', 'sans-serif'],
      },
      colors: {
        'custom-heading': '#2D2C3C',
        'custom-bg': '#2B293D',
        'custom-button': '#2B293D',
        'navbar-bg': '#2B293D',
        'highlight': '#FFE047',
        'dropdown-bg': '#f9f9f9',
        'dropdown-hover-bg': '#f1f1f1',
        'F8F9FF': '#F8F9FF',
        'highlight': '#FFE047',
      },
      boxShadow: {
        'dropdown': '0px 8px 16px 0px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
