/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {

    },
    fontFamily: {
      'sans': ['Calibri', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"']
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: "#343434",
      white: "#fff",
      dkint: {
        1: "rgba(113, 14, 32, 1)",
        2: "#e52713", // rgba(229, 39, 19, 100)",
        3: "rgba(0, 98, 93, 1)",
        4: "rgba(161, 217, 214, 1)",
        5: "rgba(161, 217, 214, 0.60)",
        6: "rgba(161, 217, 214, 0.35)",
      },
      dkext: {
        1: "rgba(255, 237, 0, 1)",
        2: "rgba(0, 153, 179, 1)",
        3: "rgba(0, 98, 93, 1)",
        4: "rgba(161, 217, 214, 1)",
        5: "rgba(161, 217, 214, 0.60)",
        6: "rgba(230, 230, 225, 1)"
      },
      dkoth: {
        1: "rgba(246, 199, 75, 1)",
        2: "rgba(233, 83, 22, 1)",
        3: "rgba(98, 128, 125, 1)",
        4: "rgba(138, 203, 193, 1)",
        5: "rgba(218, 237, 233, 1)"
      }

    },
  },
  plugins: [],
  safelist: [{
    pattern: /(bg|text|border)-dk(int|ext|oth)-[0-9]/
  }, {
    pattern: /(bg|text|border)-(transparent|current|black|white)/
  },
]
}
