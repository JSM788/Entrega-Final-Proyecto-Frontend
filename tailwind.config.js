const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // Asegúrate de incluir todos los archivos relevantes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});