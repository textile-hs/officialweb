/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a2e',
        accent: '#c9a84c',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'ui-sans-serif', 'system-ui'],
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
};
