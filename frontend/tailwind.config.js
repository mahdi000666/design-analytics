/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:              '#F7F5F0',
        surface:         '#FFFFFF',
        surface2:        '#F0EDE6',
        border:          '#E2DDD6',
        'border-strong': '#C8C2BA',
        ink:             '#1A1714',
        ink2:            '#5C5751',
        ink3:            '#9B948D',
        sidebar:         '#1A1714',
        amber:           '#D97706',
        'amber-light':   '#FEF3C7',
        'amber-dark':    '#92400E',
        teal:            '#0F766E',
        'teal-light':    '#CCFBF1',
        'teal-dark':     '#0D4E49',
        danger:          '#DC2626',
        'danger-light':  '#FEE2E2',
        info:            '#1D4ED8',
        'info-light':    '#DBEAFE',
        success:         '#15803D',
        'success-light': '#DCFCE7',
      },
      fontFamily: {
        sans:  ['-apple-system', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
        mono:  ['"Courier New"', 'monospace'],
      },
      borderRadius: {
        sm:      '4px',
        DEFAULT: '8px',
        lg:      '12px',
        full:    '9999px',
      },
    },
  },
  plugins: [],
}