/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mist: {
          50: '#f0f9ff',
          100: '#e0f2fe',
        },
        primary: {
          600: '#1989FF',
          700: '#1474E6',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
      maxWidth: {
        container: '768px', // 소형 태블릿 기준
      },
      minWidth: {
        screen: '320px', // 최소 대응 (아이폰 SE 등)
      },
      fontSize: {
        responsive: 'clamp(12px, 2.5vw, 18px)',
        heading: 'clamp(18px, 4vw, 28px)',
        small: 'clamp(10px, 2vw, 14px)',
      },
      height: {
        button: 'clamp(48px, 8vw, 62px)',
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],
}
