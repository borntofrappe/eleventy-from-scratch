const moment = require("moment");

module.exports = (value) => {
  const date = moment(value);

  return `${date.format("Do")} of ${date.format("MMMM YYYY")}`;
};
