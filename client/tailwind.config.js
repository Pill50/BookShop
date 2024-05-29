module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', 'node_modules/flowbite-react/lib/esm/**/*.js'],
  theme: {
    extend: {
      backgroundColor: {
        COMPLETED: '#0aa945',
        PENDING: '#dad107',
        SHPPED: '#e72c2c',
        CANCELLED: '#7c8289'
      }
    }
  },
  plugins: [require('flowbite/plugin')]
}
