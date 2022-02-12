const { parallel, watch } = require("gulp");

const fonts = require("./gulp-tasks/fonts");
const sass = require("./gulp-tasks/sass");
const images = require("./gulp-tasks/images");

const watcher = () => {
  watch("./src/scss/**/*.scss", { ignoreInitial: true }, sass);
  watch("./src/images/**/*", { ignoreInitial: true }, images);
};

exports.default = parallel(fonts, images, sass);

exports.watch = watcher;
