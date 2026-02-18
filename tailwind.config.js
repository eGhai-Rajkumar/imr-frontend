/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				light: '#2C6E58',
  				dark: '#0D2B22',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				light: '#A1887F',
  				dark: '#5D4037',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				light: '#F4D03F',
  				dark: '#AA8C2C',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			surface: {
  				DEFAULT: '#FAF9F6',
  				dark: '#F5F5F0'
  			},
  			'brand-blue': {
  				'50': '#EEF0FF',
  				'100': '#D8DCFF',
  				'200': '#B1B7FF',
  				'300': '#8A92FF',
  				'400': '#636DFF',
  				'500': '#2E33D4',
  				'600': '#2429AD',
  				'700': '#1B1F87',
  				'800': '#121560',
  				'900': '#090C3A'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Plus Jakarta Sans',
  				'Inter',
  				'sans-serif'
  			],
  			serif: [
  				'Playfair Display',
  				'serif'
  			]
  		},
  		backgroundImage: {
  			'gradient-nature': 'linear-gradient(to right, #1B4D3E, #2C6E58)',
  			'gradient-luxury': 'linear-gradient(to right, #D4AF37, #F4D03F)',
  			'gradient-dark': 'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.3))'
  		},
  		boxShadow: {
  			glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  			soft: '0 10px 40px -10px rgba(0,0,0,0.08)',
  			glow: '0 0 20px rgba(212, 175, 55, 0.3)'
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.6s ease-out forwards',
  			'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
  			'slide-in-right': 'slideInRight 0.6s ease-out forwards',
  			'ken-burns': 'kenBurns 20s infinite alternate',
  			float: 'float 6s ease-in-out infinite'
  		},
  		keyframes: {
  			fadeIn: {
  				from: {
  					opacity: '0'
  				},
  				to: {
  					opacity: '1'
  				}
  			},
  			fadeInUp: {
  				from: {
  					opacity: '0',
  					transform: 'translateY(30px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideInRight: {
  				from: {
  					opacity: '0',
  					transform: 'translateX(30px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			kenBurns: {
  				'0%': {
  					transform: 'scale(1)'
  				},
  				'100%': {
  					transform: 'scale(1.1)'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};