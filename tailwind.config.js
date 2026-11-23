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
      fontSize: {
        // 字體放大 1.5 倍（2026-11-23）
        xs: ['1.125rem', { lineHeight: '1.5rem' }],
        sm: ['1.3125rem', { lineHeight: '1.875rem' }],
        base: ['1.5rem', { lineHeight: '2.25rem' }],
        lg: ['1.6875rem', { lineHeight: '2.625rem' }],
        xl: ['1.875rem', { lineHeight: '2.625rem' }],
        '2xl': ['2.25rem', { lineHeight: '3rem' }],
        '3xl': ['2.8125rem', { lineHeight: '3.375rem' }],
        '4xl': ['3.375rem', { lineHeight: '3.75rem' }],
        '5xl': ['4.5rem', { lineHeight: '1.5' }],
        '6xl': ['5.625rem', { lineHeight: '1.5' }],
        '7xl': ['6.75rem', { lineHeight: '1.5' }],
        '8xl': ['9rem', { lineHeight: '1.5' }],
        '9xl': ['12rem', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
}
