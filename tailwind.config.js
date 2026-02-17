/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nature & Luxury Palette
        primary: {
          DEFAULT: '#1B4D3E', // Deep Forest Green
          light: '#2C6E58',
          dark: '#0D2B22',
        },
        secondary: {
          DEFAULT: '#8D6E63', // Earthy Brown / Wood
          light: '#A1887F',
          dark: '#5D4037',
        },
        accent: {
          DEFAULT: '#D4AF37', // Luxury Gold
          light: '#F4D03F',
          dark: '#AA8C2C',
        },
        surface: {
          DEFAULT: '#FAF9F6', // Off-white / Cream
          dark: '#F5F5F0',
        },
        // Keeping legacy brands for compatibility but marking as legacy if needed, 
        // or remapping them to new palette if we want total override. 
        // For now, I'll keep them to avoid breaking existing hardcoded classes immediately, 
        // but new components should use primary/secondary/accent.
        'brand-blue': {
          50: '#EEF0FF',
          100: '#D8DCFF',
          200: '#B1B7FF',
          300: '#8A92FF',
          400: '#636DFF',
          500: '#2E33D4',
          600: '#2429AD',
          700: '#1B1F87',
          800: '#121560',
          900: '#090C3A',
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Inter'", "sans-serif"],
        serif: ["'Playfair Display'", "serif"], // For headings
      },
      backgroundImage: {
        'gradient-nature': 'linear-gradient(to right, #1B4D3E, #2C6E58)',
        'gradient-luxury': 'linear-gradient(to right, #D4AF37, #F4D03F)',
        'gradient-dark': 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'glow': '0 0 20px rgba(212, 175, 55, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'ken-burns': 'kenBurns 20s infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          'from': { opacity: '0', transform: 'translateX(30px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};