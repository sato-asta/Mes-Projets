import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        display: ['var(--font-fraunces)', 'serif'],
        serif: ['var(--font-fraunces)', 'serif'],
      },
      colors: {
        bg: '#F6F6F8',
        surface: '#FFFFFF',
        surface2: '#EFEFF3',
        border: '#D9D9E0',
        text: '#141418',
        'text-2': '#5E5E66',
        'text-3': '#A4A4AE',
        accent: '#D64550',
        'accent-light': '#FBE8EA',
        amber: '#E39A2F',
        'amber-light': '#FFF2E1',
        blue: '#3A57D1',
        'blue-light': '#E8ECFB',
        primary: {
          50: 'rgb(240 249 255 / <alpha-value>)',
          100: 'rgb(224 242 254 / <alpha-value>)',
          200: 'rgb(186 230 253 / <alpha-value>)',
          300: 'rgb(125 211 252 / <alpha-value>)',
          400: 'rgb(56 189 248 / <alpha-value>)',
          500: 'rgb(14 165 233 / <alpha-value>)',
          600: 'rgb(2 132 199 / <alpha-value>)',
          700: 'rgb(3 105 161 / <alpha-value>)',
          800: 'rgb(7 89 133 / <alpha-value>)',
          900: 'rgb(12 61 102 / <alpha-value>)',
        },
        neutral: {
          50: 'rgb(249 250 251 / <alpha-value>)',
          100: 'rgb(243 244 246 / <alpha-value>)',
          200: 'rgb(229 231 235 / <alpha-value>)',
          300: 'rgb(209 213 219 / <alpha-value>)',
          400: 'rgb(156 163 175 / <alpha-value>)',
          500: 'rgb(107 114 128 / <alpha-value>)',
          600: 'rgb(75 85 99 / <alpha-value>)',
          700: 'rgb(55 65 81 / <alpha-value>)',
          800: 'rgb(31 41 55 / <alpha-value>)',
          900: 'rgb(17 24 39 / <alpha-value>)',
        },
        success: {
          500: 'rgb(16 185 129 / <alpha-value>)',
          600: 'rgb(5 150 105 / <alpha-value>)',
        },
        error: {
          500: 'rgb(239 68 68 / <alpha-value>)',
          600: 'rgb(220 38 38 / <alpha-value>)',
        },
        warning: {
          500: 'rgb(245 158 11 / <alpha-value>)',
          600: 'rgb(217 119 6 / <alpha-value>)',
        },
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2.5rem',
        '3xl': '3rem',
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
