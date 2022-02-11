const rssPlugin = require("@11ty/eleventy-plugin-rss");

const sortByDisplayOrder = require("./src/utils/sort-by-display-order");
const dateFilter = require("./src/filters/date-filter.js");
const w3DateFilter = require("./src/filters/w3-date-filter.js");

module.exports = (config) => {
  config.addPlugin(rssPlugin);

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

  config.addCollection("blog", (collection) => {
    return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
  });

  config.addCollection("people", (collection) => {
    return collection
      .getFilteredByGlob("./src/people/*.md")
      .sort((a, b) => (Number(a.fileSlug) > Number(b.fileSlug) ? 1 : -1));
  });

  config.addFilter("dateFilter", dateFilter);
  config.addFilter("w3DateFilter", w3DateFilter);

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);

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
