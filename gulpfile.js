const { parallel, watch } = require("gulp");

const images = require("./gulp-tasks/images");
const fonts = require("./gulp-tasks/fonts");
const sass = require("./gulp-tasks/sass");

const watcher = () => {
  watch("./src/scss/**/*.scss", { ignoreInitial: true }, sass);
  watch("./src/images/**/*", { ignoreInitial: true }, images);
};

exports.default = parallel(images, fonts, sass);

exports.watch = watcher;
