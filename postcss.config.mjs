// 📌 TypeScript가 아닌 .mjs / .js에서도 IDE 지원을 받기 위한 타입 선언
/** @type {import('postcss-load-config').Config} */
const config = {
  // CSS를 어떻게 "가공"할지 정의하는 파이프라인
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;

