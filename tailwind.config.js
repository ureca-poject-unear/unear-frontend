/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // text-[지정명]
        thin: ['LGEIHeadline-Thin', 'sans-serif'],
        light: ['LGEIHeadline-Light', 'sans-serif'],
        regular: ['LGEIHeadline-Regular', 'sans-serif'],
        semibold: ['LGEIHeadline-Semibold', 'sans-serif'],
        bold: ['LGEIHeadline-Bold', 'sans-serif'],
      },
      colors: {
        // bg-[지정명]
        // text-[지정명]
        background: '#F6F7FB', //배경용 연한 회색
        primary: '#E6007E', // 핑크
        black: '#333333', // 검정
        white: '#FFFFFF', // 흰색
        store: '#0F0034', // 스토리 네이비
      },
      backgroundImage: {
        // bg-[지정명]
        storeicon: 'linear-gradient(180deg, #094275 0%, #0F0034 100%)', //하단바 스토리 아이콘
      },

      boxShadow: {},

      fontSize: {
        // text-[지정명]
        xs: '0.625rem', // 10px
        s: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        m: '1rem', // 기본값(16px)
        lm: '1.125rem', // 18px
        lg: '1.5rem', // 24px
        xl: '2rem', // 32px
        xxl: '2.25rem', //36px
      },
      screens: {
        //추후결정
      },
    },
    plugins: [],
  },
};
