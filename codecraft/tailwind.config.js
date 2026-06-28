/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        grass: '#5D9E1D',
        dirt:  '#8B5E3C',
        stone: '#888780',
        wood:  '#B8732A',
        leaves:'#3B6D11',
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
}
