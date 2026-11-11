/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#2c2c2e',
          100: '#3a3a3e',
          500: '#7aa2f7',
          600: '#9db9f8',
          700: '#b8cdf9',
        },
        paper: {
          DEFAULT: '#1b1b1d',
          card: '#262628',
          border: '#3d3d41',
        },
        ink: {
          DEFAULT: '#f0f0f0',
          muted: '#a7a7ad',
        },
        seal: {
          DEFAULT: '#d8d8d8',
          dark: '#b5b5b5',
        },
      },
      fontFamily: {
        sans: [
          '"Microsoft JhengHei"',
          '"PingFang TC"',
          '"Noto Sans TC"',
          '"Microsoft YaHei"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        serif: ['"Noto Serif TC"', 'ui-serif', 'serif'],
      },
    },
  },
  plugins: [],
}
