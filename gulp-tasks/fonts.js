const { dest, src } = require("gulp");
const GetGoogleFonts = require("get-google-fonts");

const fonts = async () => {
  const instance = new GetGoogleFonts({
    outputDir: "./dist/fonts",
    cssFile: "./fonts.css",
  });

  const result = await instance.download(
    "https://fonts.googleapis.com/css2?family=Literata:ital,wght@0,400;0,700;1,400&family=Red+Hat+Display:wght@400;900"
  );

  return result;
};

module.exports = fonts;
