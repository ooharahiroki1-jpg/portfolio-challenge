/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans JP"', 'system-ui', 'sans-serif']
      },
      colors: {
        navy: {
          950: '#071224',
          900: '#0B1E3A',
          800: '#102A4C'
        },
        rise: {
          500: '#22C55E',
          600: '#16A34A'
        },
        fall: {
          500: '#EF4444',
          600: '#DC2626'
        },
        alert: {
          400: '#FACC15',
          500: '#F97316'
        }
      },
      boxShadow: {
        glow: '0 0 28px rgba(56, 189, 248, 0.34)',
        danger: '0 0 40px rgba(239, 68, 68, 0.45)'
      },
      backgroundImage: {
        'market-grid':
          'radial-gradient(circle at 20% 20%, rgba(56,189,248,.16), transparent 32%), linear-gradient(135deg, #071224 0%, #0B1E3A 52%, #102A4C 100%)',
        'shock-grid':
          'radial-gradient(circle at 50% 10%, rgba(239,68,68,.38), transparent 30%), linear-gradient(135deg, #120000 0%, #2a0303 55%, #070000 100%)'
      }
    }
  },
  plugins: []
};
