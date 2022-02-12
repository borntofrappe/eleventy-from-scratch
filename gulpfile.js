const { parallel, watch } = require("gulp");

const fonts = require("./gulp-tasks/fonts");
const sass = require("./gulp-tasks/sass");

const watcher = () => {
  watch("./src/scss/**/*.scss", { ignoreInitial: true }, sass);
};

exports.default = parallel(fonts, sass);

exports.watch = watcher;
