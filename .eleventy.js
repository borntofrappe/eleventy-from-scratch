const sortByDisplayOrder = require("./src/utils/sort-by-display-order");

module.exports = (config) => {
  config.addPassthroughCopy("./src/images/");

  config.addCollection("work", (collection) => {
    return sortByDisplayOrder(collection.getFilteredByGlob("./src/work/*.md"));
  });

  config.addCollection("featuredWork", (collection) => {
    return sortByDisplayOrder(
      collection
        .getFilteredByGlob("./src/work/*.md")
        .filter((d) => d.data.featured)
    );
  });

  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
