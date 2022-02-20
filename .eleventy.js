const rssPlugin = require("@11ty/eleventy-plugin-rss");

const sortByDisplayOrder = require("./src/utils/sort-by-display-order");

const dateFilter = require("./src/filters/date-filter.js");
const w3DateFilter = require("./src/filters/w3-date-filter.js");

const htmlMinTransform = require("./src/transforms/html-min-transform");

const isProduction = process.env.NODE_ENV === "production";

module.exports = (config) => {
  config.setUseGitIgnore(false);

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

  config.addCollection("blog", (collection) => {
    return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
  });

  config.addCollection("people", (collection) => {
    return collection.getFilteredByGlob("./src/people/*.md").sort((a, b) => {
      return Number(a.fileSlug) > Number(b.fileSlug) ? 1 : -1;
    });
  });

  config.addFilter("dateFilter", dateFilter);
  config.addFilter("w3DateFilter", w3DateFilter);

  config.addPlugin(rssPlugin);

  if (isProduction) {
    config.addTransform("htmlmin", htmlMinTransform);
  }

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
