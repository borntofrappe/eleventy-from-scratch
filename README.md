# eleventy-from-scratch

With this repository I set out to learn [11ty](https://www.11ty.dev/) following the guidance of [Andy Bell](https://twitter.com/piccalilli_) and his course [Learn Eleventy From Scratch](https://learneleventyfromscratch.com).

There are approximately 30 lessons, to which I dedicate individual branches.

## Lesson 21: Setting up images

Use `gulp-imagemin` to process, optimize and distribute images.

Install the library in version `7.*.*`.

```bash
npm i gulp-imagemin@7.1.0
```

Later versions introduce breaking changes.

Create a task in the `gulp-file` folder in `images.js`.

```js
const { dest, src } = require("gulp");
const imagemin = require("gulp-imagemin");
```

Export a function which processes the images through the library.

```js
const images = () => {};

module.exports = images;
```

In the function consider all the images in the `src/images` folder.

```js
return;
src("./src/images/**/*");
```

First pipe the images through the `imagemin` package.

```js
.pipe(
  imagemin(
  )
)
```

The library processes the images with a processor according to their format.

```js
imagemin([
  imagemin.mozjpeg({ quality: 60, progressive: true }),
  imagemin.optipng({ optimizationLevel: 5, interlaced: null }),
]);
```

Then pipe the processed files in the output folder.

```js
.pipe(dest("./dist/images"));
```

In `gulpfile.js` require the task and include its functionality in the watcher to consider changes in the `images` folder.

```js
watch("./src/images/**/*", { ignoreInitial: true }, images);
```

Add the task to the `parallel` function to also

```js
exports.default = parallel(fonts, images, sass);
```

## Lesson 20: Setting up fonts

Use `get-google-fonts` to:

1. grab the fonts served by Google fonts

2. store the fonts in the output folder

3. create a stylesheet which references the fonts

The goal is to ultimately complete the `<link>` element included in the previous lesson and in the base layout.

```html
<link rel="stylesheet" href="/fonts/fonts.css?{{ assetHash }}" />
```

Install the library.

```bash
npm i get-google-fonts
```

Create a task in the `gulp-file` folder in `fonts.js`.

```js
const { dest, src } = require("gulp");
const GetGoogleFonts = require("get-google-fonts");
```

Export a function which downloads two fonts from Google Fonts, Literata and Red Hat Display.

```js
const fonts = async () => {};
module.exports = fonts;
```

In the exported function create an isntance of the library specifying an output folder and a CSS file.

```js
const instance = new GetGoogleFonts({
  outputDir: "./dist/fonts",
  cssFile: "./fonts.css",
});
```

The library download the asssets in `./dist/fonts` and imports them in `./fonts.css`.

For the fonts download the specific choices through the `download` method.

```js
const result = await instance.download(
  "https://fonts.googleapis.com/css2?family=Literata:ital,wght@0,400;0,700;1,400&family=Red+Hat+Display:wght@400;900"
);

return result;
```

In `gulpfile.js` require the task and include its functionality prior to the Sass task.

```js
const fonts = require("./gulp-tasks/fonts");
const sass = require("./gulp-tasks/sass");
```

Run both tasks through the `parallel` function.

```js
exports.default = parallel(fonts, sass);
```

## Lesson 19: Setting up Sass

Use Sass to extend the CSS native language. With Gulp create a task to convert `.scss` files to `.css`.

Install three libraries to set up the task.

```bash
npm install gulp-clean-css gulp-sass@4.1.0 sass
```

- `gulp-sass` version 4.1.0 is due to breaking changes in later versions of the API

- `sass` is to have the gulp library use the canonical version of Sass insteed of the version included in `gulp-sass`

```js
const { dest, src } = require("gulp");

const cleanCSS = require("gulp-clean-css");
const sassProcessor = require("gulp-sass");

sassProcessor.compiler = require("sass");
```

For the task consider the node environment to potentially compress the output folder.

```js
const isProduction = process.env.NODE_ENV === "production";
```

Consider an array of stylesheets in `scss` format that are deemed _critical_. These assets are included in a separate location from regular stylesheets.

```js
const criticalStyles = [
  "critical.scss",
  "home.scss",
  "page.scss",
  "work-item.scss",
];
```

With `calculateOutput` create a function describe where the output is processed. This is to differentiate the location on the basis of the critical array. Critical CSS is purposed _inline_, in a `<style>` element.

Past the utility function create `sass` to consider all stylesheet and pipe them to the processor.

```js
return src('./src/scss/*.scss')
  .pipe(sassProcessor().on('error', sassProcessor.logError))
  .pipe(
    cleanCSS(
      isProduction ? {
        level: 2
      } : {}
    )
  )
  .pipe(dest(calculateOutput, { sourceMaps: !isProduction}))
  }
```

`gulp-sass` and the associated processor convert the Sass syntax to valid CSS. `gulp-clean-css` optimizes the output. The last pipe operation positions the output in the `./dist/css` or `./src/_includes/css` folder.

By default 11ty ignores the files described in `.gitignore`, among which the output folders.

```.gitignore
dist
src/_includes/css
```

Update the `config` object in `eleventy.config.js` to avoid this preference.

```js
config.setUseGitIgnore(false);
```

Add a separate file in `.eleventyignore` to describe which files 11ty should ignore.

```.eleventyignore
node_modules
```

CSS is conceptually split between critical and standard. With this in mind create am `src/scss` folder.

Create `critical.scss` to import a reset file.

```scss
@import "reset";
```

Create `_reset.scss` to add global values for the entire application. The underscore allows to have Sass ignore the file, but include its key-value pairs through the `import` statement.

Update the gulpfile `gulpfile.js` to add Sass as a task.

```js
const sass = require("./gulp-tasks/sass");
```

With the task runner use `watch` with a `watcher` helper function to process the files every time the `.scss` documents change.

```js
const { watch } = require("gulp");

const watcher = () => {
  watch("./src/scss/**/*.scss", { ignoreInitial: true }, sass);
};

exports.watch = watcher;
```

`exports.fn` is equivalent to `module.exports.fn`.

Use the `parallel` function to run the task.

```js
const { parallel } = require("gulp");

exports.default = parallel(sass);
```

`exports.default.fn` describes which task to run by default, running `npx gulp` in the command line. To watch the files you'd run `npx gulp watch`.

Update the node scripts to support `npm run start` and `npm run production`.

With the first command execute:

1. `npx gulp`

2. `concurrently \"npx gulp watch\" \"npx eleventy --serve\"

`concurrently` is a separate library to ensure the watch and serve command run together

```bash
npm install concurrently
```

With the second command set an environmental variable before running `npx gulp` and `npx eleventy`.

```bash
NODE_ENV=production npx gulp # && ...
```

The variable is picked up by the task to optimize the output in the `dist` folder.

With this setup add the critical CSS to the base layout in the `<head>` of the document.

```html
<style>
  {% include "css/critical.css" %}
</style>
```

Include additional and critical CSS with a separate variable.

```html
{% if pageCriticalStyles %} {% for item in pageCriticalStyles %}
<style>
  {% include item %}
</style>
{% endfor %} {% endif %}
```

This convenience helps to add critical stylesheets from layout files, just by defining the variable.

Past the critical values repeat the operation for non-critical CSS. In this instance inject the styles with a _hash_.

```html
<link
  rel="stylesheet"
  media="print"
  href="/fonts/fonts.css?{{ assetHash }}"
  onload="this.media='all'"
/>
```

_Aside_: the `media` attribute set to `print` tells the browser not to prioritise the stylesheet unless printing. Together with the `onload` attribute the idea is to have the browser load other essential resources first.

The `href` attribute refers to a stylesheet with a hash `assetHash`. Define the variable at the top of the base layout.

```html
{% set assetHash = global.random() %}
```

Define the helper function in `_data/global.js`. The goal is to return a random string to create a distinct hash for each build. A different hash helps to update the cache and avoid outdated CSS.

## Lesson 18: Setting up Gulp

Use Gulp to set up an asset pipeline, to convert source code and assets in the production build.

The website is scheduled to have three lines devoted to code, images and fonts. For each line Gulp helps to process the files in the `dist` folder.

Install the task manager.

```bash
npm install gulp
```

Create a task file in `gulpfile.js` and describe a first task.

```js
exports.default = () => {
  console.log("Hello world");
  return Promise.resolve();
};
```

Run `npx gulp` to print out the message in the console.

The snippet returns a promise to let Gulp conclude the current task.

## Lesson 17: Meta info, RSS feeds and module recap

Create a partial in `meta-info.html` to set meta information in the `<head>` element.

```html
<title>{{ pageTitle }}</title> <link rel="canonical" href="{{ currentUrl }}" />
```

The variables are set considering multiple configurations. For the title for instance initialize the variable with the input title and the site's name retrieved from `site.json`.

```html
{% set pageTitle = title + ' - ' + site.name %}
```

If the partial is used with a specific title override this value.

```html
{% if metaTitle %} {% set pageTitle = metaTitle %} {% endif %}
```

Include the partial in the base layout.

```html
<head>
  {% include "partials/meta-info.html" %}
</head>
```

As needed, set more specific meta variables, such as a description in `index.md`.

```md
---
metaDesc: "A made up agency site that you build if you take Learn Eleventy From Scratch, by Piccalilli"
---
```

For the RSS feed install an official 11ty module.

```bash
npm install @11ty/eleventy-plugin-rss
```

In `.eleventy.js` require include the plugin in the config object.

```js
const rssPlugin = require("@11ty/eleventy-plugin-rss");

module.exports = (config) => {
  config.addPlugin(rssPlugin);
};
```

Update `site.json` to detail additional information on the author.

```
{
  "authorName": "Issue 33",
  "authorEmail": "hi@piccalil.li"
}
```

Include the values in `rss.html` specifying the permalink for an `xml` file.

```html
---
title: "Issue 33 Blog"
summary: "A feed of the latest posts from our blog."
permalink: "/feed.xml"
---

<?xml version="1.0" encoding="utf-8"?>
```

Following the specification for the RSS feed populate the page with a series of properties to describe the posts.

```xml
<updated>{{ collections.blog | rssLastUpdatedDate }}</updated>
{% for post in collections.blog %}
  <entry>
  </entry>
{% endfor %}
```

The `rssLastUpdatedDate` filter provides a date object for the collection through the rss module.

Finally point to the feed from the base layout.

```html
<link
  rel="alternate"
  type="application/rss+xml"
  href="{{ site.url }}/feed.xml"
/>
```

## Lesson 16: Creating a work item page

Create a new layout file in `work-item.html`. With this file extend the base layout and in the block of content describe an individual item from the work collection.

```html
{% block content %}
<h1>{{ title }}</h1>
<p>{{ summary }}</p>
<img src="{{ hero.image }}" alt="{{ hero.imageAlt }}" />

{% endblock %}
```

From the front matter inject the title, summary, hero image, but also the facts and images associated with the `keyFacts` and `gallery` arrays.

```html
{% for item in keyFacts %}
<!-- li -->
{% endfor %} {% for item in gallery %}
<!-- figure -->
{% endfor %}
```

Before the end of the `<section>` used as a wrapping container the idea is to include the people associated with the specific work, so to showcase how 11ty is able to create content based on the relationship between different pieces of data.

Considering the markdown documents in the `src/work` folder the front matter adds an array of integers with the `team` key.

```md
---
team: [1, 2, 5]
---
```

These integers refer to an identifier set on the different persons in the people collection.

```md
---
title: "Creative director"
key: 1
---
```

With this in mind the layout file retrieves a reference to the people associated with the project by filtering the people collection according to `team`.

Create a helper function for the filtering operation in `helper.js`.

```js
filterCollectionByKeys(collection, keys) {
  return collection.filter((d) => keys.includes(d.data.key));
},
```

In the layout file call the function on the people collection with the array of keys.

```js
helpers.filterCollectionByKeys(collections.people, team);
```

In this manner you consider only the people whose key is present in the `team` array.

Store the list in a variable and use its value with the `people` partial.

```html
{% set peopleItems = helpers.filterCollectionByKeys(collections.people, team) %}
{% if peopleItems %}
<h2>Meet the team behind this project</h2>
{% include "partials/people.html" %} {% endif %}
```

Finally, add a data configuration file in `work.json` so that the markdown files rely on the layout.

```json
{
  "layout": "layouts/work-item.html"
}
```

## Lesson 15: Adding our work landing page

Create a new layout file in `work-landing.html`. With this file extend the base layout, set a specific title and summary.

In the content block add a partial for the header and loop through a `work` collection to show the corresponding image.

```html
{% for item in collections.work %}
<figure>
  <img src="{{ item.data.hero.image }}" alt="{{ item.data.hero.imageAlt }}" />
</figure>
{% endfor %}
```

The named collection is already created for a previous lesson, [creating our first collection](#lesson-8-creating-our-first-collection).

Create a new page in `work.md` with a specific title and layout file.

```md
---
title: "Our finest work"
layout: "layouts/work-landing.html"
---
```

## Lesson 14: Adding our about page

Create a new layout file in `about.html`. With this file extend the base layout, set a specific title, summary.

```html
{% set pageHeaderTitle = title %} {% set pageHeaderSummary = content %}

<!-- block content -->
{% include "partials/page-header.html" %}
```

Moreover, set a variable for a collection to show through a dedicated partial `people.html`.

```html
{% set peopleItems = collections.people %}

<!-- block content -->
{% if peopleItems %} {% include "partials/people.html" %} {% endif %}
```

Create the partial `people.html` to show the collection with an ordered list and one image for each person.

```html
<ol>
  {% for item in peopleItems %}
  <!-- list item -->
  {% endfor %}
</ol>
```

To populate the page and the partial create a `people` collection in the config file.

```js
config.addCollection("people", (collection) => {
  return collection.getFilteredByGlob("./src/people/.md");
});
```

The lesson sorts the person by `fileSlug`, meaning 11ty considers the alphabetical order of the files without extension..

```js
return collection
  .getFilteredByGlob("./src/people/.md")
  .sort((a, b) => (Number(a.fileSlug) > Number(b.fileSlug) ? 1 : -1));
```

Finally create the actual page `about.html` describing the title, layout and content.

```md
---
title: "About Issue 33"
layout: "layouts/about.html"
---

Wanna see...
```

With the permalink describe a specific URL instead of the default `/about/index.html`

```md
---
permalink: "/about-us/index.html"
---
```

## Lesson 13: Recommended content

Create a section to show additional articles, recommended content past the current article.

In `_data.helper.js` create and export a helper function which receives a collection, the current page as well as the number of articles and whether or not to pick the posts at random.

```js
getSiblingContent(collection, page, limit, random) {}
```

The `limit` is set by default to 3, while `random` is set by default to `true`.

```js
getSiblingContent(collection, page, limit = 3, random = true) {}
```

Based on this information create a collection of articles skipping the one displayed in the current page.

```js
let filteredItems = collection.filter((d) => d.url !== page.url);
```

If choosing the article at random loop through the array backwards swapping the current item with a value present earlier in the collection.

With the possibly random array return the entire list or just the items described by the limit.

```js
return limit ? filteredItems.slice(0, limit) : filteredItems;
```

In the post layout `post.html` set a variable to refer to the accompanying articles.

```html
{% set recommendedPosts = helpers.getSiblingContent(collections.blog, page) %}
```

Use the variable to optionally show a footer and a list for the matching posts.

```html
{% if recommendedPosts %}
<footer>
  <!--  -->
</footer>
{% endif %}
```

Instead of creating a new list rely
on the `post-list.html` partial through the different variables `postListItems` and `postListHeadline`.

```html
{% set postListItems = recommendedPosts %} {% set postListHeadline = "More from
the blog" %} {% include "partials/post-list.html" %}
```

## Lesson 12: Blog post view, directory data and filters

The lesson creates the page devoted individual blog posts.

Create a layout in `post.html` to render the content of the markdown files.

```html
{% block content %}
<article>
  {% include "partials/page-header.html" %}

  <div>{{ content | safe }}</div>
</article>
{% endblock %}
```

In the block include content and the header's partial. For the header define `pageHeaderTitle` with the upcoming markdown file's title.

```html
{% set pageHeaderTitle = title %}
```

Again for the header set `pageHeaderSummary` to refer to a specific markup structure.

```html
{% set pageHeaderSummary %}
<time>...</time>
<p>...</p>
{% endset %}
```

The `set` statement makes it possible to store the markup in the summary variable, which is then included in the `page-header` partial.

For the tags loop through the input array to generate a list of items.

```html
% for tag in tags %}
<li>
  <a href="/tag/{{ tag | slug }}/">#{{ tag | title | replace(' ', '') }}</a>
</li>
{% endfor %}
```

In the body of the anchor link use the `title` filter to create a capitalized version of the tag. Use the `replace` filter to remove whitespace.

For the `href` attribute use the `slug` filter to produce a lowercase label where spaces are replaced with hyphens. `Design Thinking` becomes `design-thinking`.

`slug`, `title` and `replace` are provided by 11ty and Nunjucks. Create your own filters with JavaScript functions. For the date, for instance create `date-filter.js` and `w3-date-filter.js` to format a date object. Taking the latter of the two as an example create and export a function.

```js
module.exports = (value) => new Date(value).toISOString();
```

In the config file `.eleventy.js` require the filter and add the functionality through the `config` object.

```js
const w3DateFilter = require("./src/filters/w3-date-filter.js");

// config
config.addFilter("w3DateFilter", w3DateFilter);
```

Use the filter like other available filters.

```html
<time datetime="{{ date | w3DateFilter }}"></time>
```

The markdown documents in `src/posts` are rendered as-is. To benefit from the layout file add a _directory data file_ in `src/posts/posts.json`.

```json
{
  "layout": "layouts/post.html",
  "permalink": "/blog/{{ title | slug }}/index.html"
}
```

11ty applies the layout file on any markdown document in the same repository which does not specify a separate layout.

With the permalink field create a page in the `/blog` route instead of `/posts`, the default 11ty uses considering the folder structure.

## Lesson 11: Blog feeds, tags and pagination

The lesson produces a blog from articles in `src/posts`. Each article has a title, date and tags defined in the frontmatter.

```md
---
title: "A Complete Guide to Wireframe Design"
date: "2020-04-13"
tags: ["Tutorial", "Learning"]
---
```

_Aside_: technically tags includes the values in a JSON array, not a YAML array

```yaml
tags:
  - "Tutorial"
  - "Learning"
```

11ty processes either format.

_Aside_: dates are in ISO format, but 11ty allows to specify alternative values, date strings, as well two keywords: `Last Modified` and `Created`. Without a value the date refers to when the file was first created.

From this starting point, update the config file to create a blog collection.

```js
config.addCollection("blog", (collection) => {
  return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
});
```

By default 11ty populates the array in chronological order. By reversing the array you position the most recent articles first. Spreading the array allows _not_ to mutate the collection in place.

Create a layout file in `feed.html` which extends the base layout and shows the articles through a header and list.

```html
{% set pageHeaderTitle = title %} {% set pageHeaderSummary = content %} {% set
postListItems = pagination.items %} {% block content %}
<article>
  {% include "partials/page-header.html" %} {% include "partials/post-list.html"
  %}
</article>
{% endblock %}
```

Before the content the layout sets three variables which are then used in the two partials. `title`, `content` and `pagination` are made available from a markdown files created later.

Create the partial `page-header.html` to show the title and optionally the summary.

```html
<h1>{{ pageHeaderTitle }}</h1>

{% if pageHeaderSummary %}
<div>{{ pageHeaderSummary | safe }}</div>
{% endif %}
```

Create the partial `post-list.html` to optionally show a headline and the collection with a for loop.

```html
{% if postListHeadline %}
<h2>{{ postListHeadline }}</h2>
{% endif %}

<ol>
  {% for item in postListItems %}
  <li>
    <a href="{{ item.url }}">{{ item.data.title }}</a>
  </li>
  {% endfor %}
</ol>
```

Create `blog.md` alonside the index file describing several variables in the front matter.

```md
---
title: "The Issue 33 Blog"
layout: "layouts/feed.html"
pagination:
  data: collections.blog
  size: 5
---

The latest articles from around the studio, demonstrating our design thinking, strategy and expertise.
```

The feed layout receives the title from the front matter, the content from the text after the key value pairs and the pagination from `pagination`. The value has a special meaning in 11ty:

- through `data` consider an array or a collection — in this instance the blog collection

- through `size` create a collection of batches, each with a specific number of items

The end result is that 11ty creates a `pagination.items` collection. This is the value the feed layout passes to the list partial.

```html
{% set postListItems = pagination.items %}
```

There are additional variables in the front matter which will become relevant at a later stage.

```md
---
permalink: "blog{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html"
paginationPrevText: "Newer posts"
paginationNextText: "Older posts"
paginationAnchor: "#post-list"
---
```

`permalink` includes a value through Nunjucks syntax, creating a variety of URL values. `pageNumber` is an additional variable included by 11ty in the pagination collection.

```text
blog/index.html
blog/page/1/index.html
blog/page/2/index.html
```

Create a partial in `pagination.html` to link to show the different batches in the collection. Condition the markup to the presence of an anchor link pointing to the following or previous batch. 11ty adds `href` to the pagination object if necessary.

```html
{% if pagination.href.next or pagination.href.previous %} {/if}
```

For each link create an anchor link referencing the URL.

```html
{% if pagination.href.previous %}
<a href="{{ pagination.href.previous }}{{ paginationAnchor }}">
  <span>{{ paginationPrevText if paginationPrevText else 'Previous' }}</span>
</a>
{% endif %}
```

In the `<span>` element inject the label from the chosen variable or a default value with Nunjucks' ternary operator.

In the anchor link use the `href` provided in the pagination objct and the anchor defined in the front matter.

Include the partial in the layout `feed.html`.

```html
{% include "partials/pagination.html" %}
```

### Tags

The lesson creates pages to show articles matching a specific tag with a specific URL.

```text
tag/tutorial
tag/design-thinking
```

Create `tags.md` with a series of variables.

```md
---
title: "Tag Archive"
layout: "layouts/feed.html"
pagination:
  data: collections
  size: 1
  alias: tag
  filter: ["all", "nav", "blog", "work", "featuredWork", "people", "rss"]
permalink: "/tag/{{ tag | slug }}/"
---
```

For the pagination:

- with `data` point to all the collections 11ty creates in `collections`

- with `alias` consider a variety of tags, such as `tutorial` or again `design-thinking` — notice how the value is included in the permalink

- with `filter` have 11ty skip certain collections

With this setup when you create an article with a tag 11ty creates a collection for the specific tag and then a page for said collection.

The tag page extends the feed layout. Update the logic to handle the generic pagination, for `blog.md`, and the one devoted to the tag, `tag.md`.

With a tag reference a specific collection.

```html
{% if tag %} {% set postListItems = collections[tag] %} {% set pageHeaderTitle =
'Blog posts filed under “' + tag + '”' %} {% endif %}
```

With a tag skip the pagination partial.

```html
{% if not tag %} {% include "partials/pagination.html" %} {% endif %}
```

## Lesson 10: Home page complete and recap

Update the title in `index.md`.

```html
---
title: "Issue 33"
---
```

Wrap the content of the home layout in a `<div>` container.

```html
<div class="wrapper">
  <!-- article -->
</div>
```

## Lesson 9: Adding remote data

Using data from a remote source allows 11ty to function as a front-end for a content management system.

The course provides data in the form of a JSON object with an array images following a specific URL: `https://11ty-from-scratch-content-feeds.piccalil.li/media.json`.

Install `node-fetch` to fetch the data.

_Aside_: at the time of writing installing the latest version of package raises an error. Install a `2.*.*` version to keep using the `require` keyword.

```bash
npm i node-fetch@2.6.7
```

In the `_data` folder create `studio.js` to retrieve the data with the `fetch` method.

```js
const fetch = require("node-fetch");
```

Similary to `helpers.js` export a function. In this instance export an async function which returns the collection from the provided URL.

```js
module.exports = async () => {
  try {
    const res = await fetch("...");
    const { items } = await res.json();

    return items;
  } catch (error) {
    console.log(error);
    return [];
  }
};
```

In the catch block return an empty array as a fallback value.

The data is available like the other files in the same folder.

```html
<p>There are {{ studio.length }} items in the remote collection</p>
```

With `node-fetch` and the `fetch` method the website requires the data and associated images with each request. The course introduces a separate library `@11ty/eleventy-cache-assets` to cache the data so that subsequent visits rely on information which is already available.

Uninstall `node-fetch`.

```bash
npm uninstall node-fetch
```

Install the chosen library.

```bash
npm install @11ty/eleventy-cache-assets
```

Update `studio.js` so that the items are retrieved with the new module.

```js
const Cache = require("@11ty/eleventy-cache-assets");

// try
const { items } = await Cache(
  "https://11ty-from-scratch-content-feeds.piccalil.li/media.json",
  {
    duration: "1d",
    type: "json",
  }
);
```

Create a partial in `studio-feed.html` to loop through the images if available.

```html
{% if studio.length %}
<!-- for item in studio -->
{% endif %}
```

Include the partial in the home layout after the featured work.

```html
{% include "partials/studio-feed.html" %}
```

Update `index.md` to define a title for the studio feed article — the variable is used in the feed's partial.

```md
---
studioFeed:
  title: "From inside the studio"
---
```

## Lesson 8: Creating our first collection

Collections work as groups of content. 11ty provides collections automatically, but it is possible to create your own.

In the config file `.eleventy.js` add a collection before the `return` statement.

```js
config.addCollection("work", (collection) => {});
```

`addCollection` receives the name of the collection and a callback function which describes the collection itself.

To retrieve a reference to the markdown files use the `getFilteredByGlob` method.

```js
return collection.getFilteredByGlob("./src/work/*.md");
```

The function returns an array which is sorted by `displayOrder` a value decribed in the front matter. The front matter is made available in a `data` property for each imported file.

```js
return collection
  .getFilteredByGlob("./src/work/*.md")
  .sort((a, b) =>
    Number(a.data.displayOrder) > Number(b.data.displayOrder) ? 1 : -1
  );
```

The collection is made available to templating languages through `collections`.

```html
<p>There are {{collections.work.length}} items in the work collection</p>
```

Create a separate collection for _featured_ work, filtering the markdown files through the `featured` key in the front matter.

```js
config.addCollection("featuredWork", (collection) => {
  return (
    collection
      // get and sort
      .filter((d) => d.data.featured)
  );
});
```

Since the two collections share the sorting by `displayOrder` create and export a utility function in `src/utils/sort-by-display-order.js`.

```js
module.exports = (collection) =>
  collection.sort((a, b) =>
    Number(a.data.displayOrder) > Number(b.data.displayOrder) ? 1 : -1
  );
```

Import the function in the config file and use it for both collections.

```js
const sortByDisplayOrder = require("./src/utils/sort-by-display-order");

// config
return sortByDisplayOrder(collection.getFilteredByGlob("./src/work/*.md"));
```

To use the collection create a partial in `featured-work.html`.

```html
{% for item in collections.featuredWork %}
<a href="{{ item.url }}">
  <!--  -->
</a>
{% endfor %}
```

Include the partial in the home layout between the call to action partials.

```html
{% include "partials/featured-work.html" %}
```

## Lesson 7: Data basics

Eleventy works with a _global data system_.

Create a folder in `_data`.

Create a data file in `site.json`.

```json
{
  "name": "Issue 33",
  "url": "https://issue33.com"
}
```

11ty makes the information available in any templating file.

```html
<a href="/" aria-label="{{ site.name }} - home"></a>
```

With a more complex structure create `navigation.json` with an array of items.

```json
{
  "items": [
    {
      "text": "Home",
      "url": "/"
    }
    // {...}
  ]
}
```

Loop through the structure with a `{% for %}` statement.

```html
{% for item in navigation.items %}
<li>
  <a href="{{item.url}}">{{item.text}}</a>
</li>
{% endfor %}
```

Data is not limited to JSON files. With JavaScript syntax export values such as helper functions.

In `helpers.js` export an object with a `getLinkActiveState` function.

```js
module.exports = {
  getLinkActiveState(itemUrl, pageUrl) {},
};
```

For the specific function return a string with specific `aria-` and `data-` attribute if the url of the item matches the url of the page.

Use the function directly in the markup.

```html
<a href="{{item.url}}" {{helpers.getLinkActiveState(item.url, page.url)}}> </a>
```

11ty provides `page` as global data.

_Aside_: the `aria-current` attribute is set to `page` for the anchor link matching the current page to improve accessibility

A call to action helps to reiterate the lessons included so far:

- create a data file in `cta.json` with fields such as `title` and `summary`

- create a partial in `cta.html` using the information set on a separate variable, `ctaPrefix`

  ```html
  <h2>{{ ctaPrefix.title }}</h2>
  ```

  The idea is to use `ctaPrefix` with the data from the JSON file _or_ the information passed through a separate variable.

  ```html
  {% set ctaPrefix = cta %} {% if ctaContent %} {% set ctaPrefix = ctaContent %}
  {% endif %}
  ```

- use the partial in `home.html` in two instances, setting `ctaContent` to a separate variable and then to the data in the JSON object

  ```html
  {% set ctaContent = primaryCTA %} {% include "partials/cta.html" %}
  <!--  -->
  {% set ctaContent = cta %} {% include "partials/cta.html" %}
  ```

- in `index.md` define the `primaryCTA` variable

  ```md
  ---
  <!-- ... -->
  primaryCTA:
    title: "This is an agency that doesn’t actually exist"
    summary: "This is ..."
  ---
  ```

## Lesson 6: Partials basics

Partials are fragments in which to split the codebase.

Create a folder for partial files in `_includes/partials`.

Create a partial in `site-head.html` with a `<header>` wrapping around a company logo and basic navigation.

Include the partial in any templating file, such as `base.html`.

```html
{% include "partials/site-head.html" %}
```

Partials are not constrained to `.html` documents. It is possible to include any other format such as `.svg` for a company logo.

```html
{% include "partials/brand.svg" %}
```

_Aside_:

- the `.svg` logo has an `aria-hidden` and `focusable` attribute to improve accessibility. The graphic is treated as purely decorative

- `base.html` injects the block content in a `<main>` container with a `tabindex` and `id` attribute. The landmark can be focused with an anchor link pointing to the identifier

- the `<header>` element in the partial has a role of `banner` to improve accessibility

## Lesson 5: Passthrough basics

Passthrough is how you let 11ty know to copy assets in the output folder. The feature is useful for static images and stylesheet files, included as-is.

Update the eleventy config file to keep the images in `src/images`.

```js
config.addPassthroughCopy("./src/images/");
```

## Lesson 4: Front matter basics

Front matter is how you define variables in markdown documents. The syntax follows the YAML language including the variables with key value pairs in between `---` dashes.

Update `index.md` to include an `intro` with several fields such as `main` and `summary`.

```md
---
intro:
  main: "Bread & Butter"
  summary: "..."
---
```

Inject the values as if `intro` were an object.

```html
<p>{{ intro.summary }}</p>
```

## Lesson 3: Nunjucks basics

Nunjucks refers to a _templating language_ to create markup with logic — consider variables and loops.

Add the `njk` extension to the eleventy config file.

```js
return {
  markdownTemplateEngine: "njk",
  dataTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  // dir
};
```

The configuration allows to include Nunjucks syntax in `.html` documents.

Create a folder for layout files in `_includes/layouts`.

Create a base layout in `base.html` with the skeleton of an HTML page — the initial structure is produced with Emmet and the `!` abbreviation.

In the `<title>` element inject the value of a `title` variable.

```html
<title>{{ title }}</title>
```

In the `<body>` element inject the content provided by a _block_.

```html
<body>
  {% block content %}{% endblock %}
</body>
```

The block works as a placeholder for any time of content using the layout.

```html
{% block content %}
<h1>Hello world</h1>
{% endblock %}
```

With the snippet the heading would replace the block placeholder.

Create a separate layout file in `home.html` which extends from the base layout.

```html
{% extends "layouts/base.html" %}
```

Add a specific markup structure in the placeholder block.

```html
{% block content %}
<article>
  <h1>{{ title }}</h1>
  {{ content | safe }}
</article>
{% endblock %}
```

In the context of markdown documents `content` refers to the text beyond the front matter. `safe` is a _filter_ to automatically escape the input.

Update `index.md` to define the `title` variable in the front matter and reference the layout file.

```md
---
title: "Hello world"
layout: "layouts/home.html"
---

This is pretty _rad_, right?
```

The index file uses the home layout, the home layout extends the base layout. The end result is that 11ty creates an `.html` page with the variable and content.

_Aside:_ without the `safe` flag the content would include the HTML tags associated with the markdown file.

```html
<p>This is pretty <em>rad</em>, right?</p>
```

## Lesson 2: Hello world

Create `.eleventy.js` as a configuration file. Describe the input and output folders for the utility.

```js
module.exports = (config) => {
  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
};
```

Initialize a package file with `npm init -y`.

Install eleventy with `npm install @11ty/eleventy`.

Create `index.md` in the `src` folder.

```md
Hello world
```

Serve the website with `npx eleventy -serve`.

Out of convenience include the command in one of the script in the package file.

```json
{
  "scripts": {
    "start": "npx eleventy --serve"
  }
}
```

The page is served on `localhost:8080`.

## Lesson 1: Intro

In the `src` folder add the assets provided [in the course](https://learneleventyfromscratch.com/lesson/1.html#getting-some-starter-files).

In `.gitignore` list a series of files and folders which are beyond the scope of the git flow.
