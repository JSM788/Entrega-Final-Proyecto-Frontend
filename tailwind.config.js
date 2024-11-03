const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Asegúrate de incluir todos los archivos relevantes
  ],
  theme: {
    extend: {
      colors: {
        deepTeal: "#2A606E",
        aquaTeal: "#6ADCC7",
        mintTeal: "#DEECEC",
        mintTeal2:"#c8ece5",
        customGrayTransparent: '#D9D9D9B2',
        customGray: '#F1F1F1',
        customGray2:"#F9F9F9",
        customGray3:"#ACACAC",
        customBlack:"#272727",
        customBlack2:"#595858",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
});
