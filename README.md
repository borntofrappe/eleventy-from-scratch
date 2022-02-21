# eleventy-from-scratch

[Andy Bell](https://twitter.com/hankchizljaw) teaches [11ty](https://www.11ty.dev/) with the course [Learn Eleventy From Scratch](https://learneleventyfromscratch.com).

This repository builds toward [the final website](https://issue33.com/) following the course lesson by lesson, branch by branch.

## Lesson 1: Intro

[Download the starter files](https://piccalilli.s3.eu-west-2.amazonaws.com/eleventy-from-scratch/eleventy-from-scratch-starter-files.zip) and extract the `src` folder in the local directory.

Add a `.gitignore` file to remove a series of files and folders from the git control.

## Lesson 2: Hello world

Create `.eleventy.js` as a configuration file.

In `.eleventy.js` describe the folders used by the utility.

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

> 11ty will consider the files in the `src` folder, produce the website in a `dist` folder.

Initialize a package file.

```bash
npm init -y
```

Install eleventy.

```bash
npm install @11ty/eleventy
```

Create a markdown file `index.md` in the `src` folder.

```md
Hello world
```

Serve the website.

```bash
npx eleventy --serve
```

> 11ty will set up a local environment on localhost:8080

Out of convenience include the command in one of the scripts from the package file.

```json
{
  "scripts": {
    "start": "npx eleventy --serve"
  }
}
```

Serve the website.

```bash
# npx eleventy -serve
npm run start
```

## Lesson 3: Nunjucks basics

Nunjucks is a _templating language_ to create markup files with markup syntax and logic — think variables, loops.

Add the `njk` extension to the eleventy config file so that `.html` files are processed with Nunjucks.

```js
return {
  markdownTemplateEngine: "njk",
  dataTemplateEngine: "njk",
  htmlTemplateEngine: "njk",

  // ...
};
```

Create a folder for layout files in `_includes/layouts`.

In the `layouts` folder create a base layout `base.html` with the skeleton of an HTML page — the initial structure is produced with Emmet and the `!` abbreviation.

In the `<title>` element inject the value of a `title` variable.

```njk
<title>{{ title }}</title>
```

In the `<body>` element inject the content in a _block_.

```njk
<body>
  {% block content %}
  {% endblock %}
</body>
```

---

Nunjucks' block works as a placeholder. In the file using the base layout you include the content wrapping the markup in a similar block.

```njk
{% block content %}
  <h1>Hello world</h1>
{% endblock %}
```

With the snippet the heading would replace the block placeholder.

```html
<body>
  <h1>Hello world</h1>
</body>
```

---

Create a separate layout file in `home.html` which extends the base layout.

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

---

In the context of markdown documents `content` refers to the text beyond the front matter.

```md
---
title: "Hello world"
---

This is the content...
```

`safe` is a Nunjucks' _filter_ to automatically escape the input.

11ty produces markup from the markdown file, which is then included as-is.

```html
<p>This is the content...</p>
```

Without the filter the page would render the entire string, including the HTML tags.

---

Update `index.md` to define the `title` variable in the front matter and reference the layout file.

```md
---
title: "Hello world"
layout: "layouts/home.html"
---

This is pretty _rad_, right?
```

The index file uses the home layout, the home layout extends the base layout. The result is that 11ty creates an `.html` page injecting the variable and content.

## Lesson 4: Front matter basics

Front matter is how you define variables in markdown documents. The syntax follows the YAML language including the variables with key value pairs in between `---` dashes.

```md
---
title: "Hello world"
layout: "layouts/home.html"
---
```

Update `index.md` to define `intro` with several fields such as `eyebrow` and `main`.

```md
---
intro:
  eyebrow: "Digital Marketing is our"
  main: "Bread & Butter"
---
```

Update the home layout `home.html` to inject the values as if `intro` were a JavaScript object.

```njk
<h1>
  {{ intro.eyebrow }} <em>{{ intro.main }}</em>
</h1>
```

> the elements in `home.html` include several classes later useful to style the website with CSS

## Lesson 5: Passthrough basics

_Passthrough_ is how you let 11ty know to copy assets in the output folder — `dist`. The feature is useful for static images and stylesheet files, which need to be included as-is.

Update the eleventy config file to keep the images in `src/images`.

```js
config.addPassthroughCopy("./src/images/");
```

> the image in the home layout is displayed instead of the alt text describing the missing asset

## Lesson 6: Partials basics

_Partials_ are fragments, additional `.html` files, in which to split the codebase.

Update the base layout `base.html` to wrap the content in a `<main>` element.

```njk
<main tabindex="-1" id="main-content">
  {% block content %}
  {% endblock %}
</main>
```

---

`tabindex` and the specific `id` attribute help to improve the accessibility of the website.

The idea is to remove the container from keyboard navigation, through `tabindex` set to -1, but reachable with an anchor link pointing to the specific `id`.

```html
<a href="#main-content">Skip to content</a>
```

With the link you allow readers to skip previous landmarks and reach the content immediately.

---

Create a folder for partial files in `_includes/partials`.

Create a partial `site-head.html` with a `<header>` wrapping around a company logo and basic navigation.

---

The `<header>` element in the partial has a role of `banner` to improve accessibility.

---

Include the partial in the layout file `base.html`, before the `<main>` container.

```html
{% include "partials/site-head.html" %}

<main tabindex="-1" id="main-content"></main>
```

In `site.head.html` notice the partial referencing a vector graphic. This is because partials are not constrained to `.html` documents.

```html
{% include "partials/brand.svg" %}
```

---

The vector graphic `brand.svg` has an `aria-hidden` and `focusable` attribute to improve accessibility. The graphic is treated as purely decorative

---

## Lesson 7: Data basics

Eleventy works with a _global data system_.

Create a folder in `src/_data`.

Create a data file `site.json`.

```json
{
  "name": "Issue 33",
  "url": "https://issue33.com"
}
```

11ty makes the information available anywhere in the repository through the name of the file: `site.name`, `site.url`.

Update `site-head.html` to replace the hard-coded name of the website with the value of the variable.

```diff
-<a aria-label="Issue 33 - home"></a>
+<a aria-label="{{ site.name }} - home"></a>
```

Create `navigation.json` with an array of items.

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

Update `site.head` to loop through the structure with a `for` statement.

```njk
{% for item in navigation.items %}
  <li>
    <a href="{{ item.url }}">{{ item.text }}</a>
  </li>
{% endfor %}
```

Nunjucks loops through the collection to produce a list item for each link.

Data is not limited to JSON files. Through JavaScript 11ty allows to export values such as helper functions.

In the data folder create `helpers.js` and export an object with a `getLinkActiveState` function.

```js
module.exports = {
  getLinkActiveState(itemUrl, pageUrl) {},
};
```

For the specific function return a string with a specific `aria-` and `data-` attribute if the url of the item matches the url of the page.

Use the function directly in the markup.

```njk
<a
  href="{{ item.url }}"
  {{ helpers.getLinkActiveState(item.url, page.url) |  safe }}>
  {{item.text}}
</a>
```

`page` is available as a global variable and refers to the current page.

---

The `aria-current` attribute is set to `page` for the anchor link matching the current page to improve accessibility.

---

To reiterate the data system create a data file in `cta.json` with fields such as `title` and `summary`.

```json
{
  "title": "Get in touch if we seem like a good fit",
  "summary": ""
}
```

Create a partial `cta.html` using the information set on a separate variable, `ctaPrefix`

```njk
<h2>{{ ctaPrefix.title }}</h2>
```

The idea is to use `ctaPrefix` with the data from the JSON file _or_ the information passed through a separate variable.

```njk
{% set ctaPrefix = cta %}

{% if ctaContent %}
  {% set ctaPrefix = ctaContent %}
{% endif %}
```

Update `home.html` to include two call to actions after the `<article>` element, one with the default data, one with a title and content set through the markdown file.

```njk
{% set ctaContent = primaryCTA %}
{% include "partials/cta.html" %}

{% set ctaContent = cta %}
{% include "partials/cta.html" %}
```

Update `index.md` to define the variables for the non-default call to action.

```md
---
primaryCTA:
  title: "This is an agency that doesn’t actually exist"
  summary: "This is ..."
---
```

## Lesson 8: Creating our first collection

_Collections_ are how eleventy provides groups of content. The utility creates a few collections automatically, but it is possible to create your own.

The goal is to create a collection for work items, for the markdown files in the `src/work` folder.

In `.eleventy.js` add the collection before the `return` statement.

```js
config.addCollection("work", (collection) => {});
```

`addCollection` receives the name of the collection and a callback function which describes the collection itself.

To retrieve a reference to files in the `src` folder use the `getFilteredByGlob` method.

```js
const workItems = collection.getFilteredByGlob("./src/work/*.md");
console.log(workItems);
```

The function returns an array in which each file is described by an object with a series of keys.

```js
/*
inputPath: './src/work/travel-today.md',
fileSlug: 'travel-today',
filePathStem: '/work/travel-today',
data: {
    pkg: [Object],
    title: 'Travel Today',
    summary: 'A travel website to help make booking easier.',
    displayOrder: 5,
}
*/
```

Among the keys `data` describes the front matter.

Sort the collection by the value of `displayOrder`.

```js
return collection
  .getFilteredByGlob("./src/work/*.md")
  .sort((a, b) =>
    Number(a.data.displayOrder) > Number(b.data.displayOrder) ? 1 : -1
  );
```

Once added to the `config` object 11ty makes the data available through the `collections` variable.

```html
<p>There are {{collections.work.length}} items in the work collection</p>
```

Create a separate collection for featured work items, filtering the markdown files through the `featured` key.

```js
config.addCollection("featuredWork", (collection) => {
  return (
    collection
      // get and sort
      .filter((d) => d.data.featured)
  );
});
```

Since the two collections share the sorting by `displayOrder` create a folder for utility functions in `src/utils`.

Create and export a function in `sort-by-display-order.js`.

```js
module.exports = (collection) =>
  collection.sort((a, b) =>
    Number(a.data.displayOrder) > Number(b.data.displayOrder) ? 1 : -1
  );
```

Import the function in the configuration file and use it for both collections.

```js
const sortByDisplayOrder = require("./src/utils/sort-by-display-order");

// config
return sortByDisplayOrder(collection.getFilteredByGlob("./src/work/*.md"));
```

To use the collection create a partial in `featured-work.html`.

```njk
{% for item in collections.featuredWork %}
  <a href="{{ item.url }}"></a>
{% endfor %}
```

Include the partial in the `home.html` between the call to actions.

```njk
{% include "partials/featured-work.html" %}
```

## Lesson 9: Adding remote data

Using data from a remote source allows 11ty to function as the front-end for a content management system.

The course provides data in the form of a JSON object with an array images following a specific URL: `https://11ty-from-scratch-content-feeds.piccalil.li/media.json`.

Install `node-fetch` to fetch the data.

```bash
npm i node-fetch@2.6.7
```

---

Install version `2.*.*` to keep using the `require` keyword used in the project.

---

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

The data is available like the other files in the same folder, through a `studio` variable.

```njk
<p>There are {{ studio.length }} items in the remote collection</p>
```

With `node-fetch` and the `fetch` method the website requires the data and associated images with each request. The course introduces a separate library `@11ty/eleventy-cache-assets` to cache the data so that subsequent visits rely on information which is already available.

Uninstall `node-fetch`.

```bash
npm uninstall node-fetch
```

Install a different library provided by 11ty to cache the assets.

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

In both instances 11ty creates a `studio` variable with the array of images.

Create a partial `studio-feed.html` to loop through the images, if any.

```njk
{% if studio.length %}
  <!-- for item in studio -->
{% endif %}
```

Include the partial in `home.html` after the featured work.

```njk
{% include "partials/studio-feed.html" %}
```

Update `index.md` to define a title for the studio feed article — the variable is used in the feed's partial.

```md
---
studioFeed:
  title: "From inside the studio"
---
```

## Lesson 10: Home page complete and recap

Update the title in `index.md`.

```md
---
title: "Issue 33"
---
```

Wrap the content in `home.html` in a `<div>` container with a specific class.

```html
<div class="wrapper">
  <!-- article -->
</div>
```

## Lesson 11: Blog feeds, tags and pagination

11ty is often touted as an excellent tool for personal websites and blogs. The lesson produces a blog considering the articles in `src/posts`.

Each markdown file has a `title`, `date` and `tags` defined in the frontmatter.

```md
---
title: "A Complete Guide to Wireframe Design"
date: "2020-04-13"
tags: ["Tutorial", "Learning"]
---
```

---

The tags are defined with a JSON array, but it is possible to rely on YAML syntax as well.

```md
---
tags:
  - "Tutorial"
  - "Learning"
---
```

Dates are in _ISO format_, but 11ty allows to specify alternative values, such as date strings and two keywords: 'Last Modified' and 'Created'. Without a value the date refers to when the file was first created — 'Created'.

---

Update the config file to create a blog collection.

```js
config.addCollection("blog", (collection) => {
  return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
});
```

By default 11ty populates the array in chronological order. By reversing the array you position the most recent articles first.

---

With the spread operator the array is not modified in place.

```diff
-collection.reverse()
+[...collection].reverse()
```

---

Create a layout file `feed.html` which extends the base layout and shows the articles through a header and list.

```njk
{% extends "layouts/base.html" %}

{% set pageHeaderTitle = title %}
{% set pageHeaderSummary = content %}
{% set postListItems = pagination.items %}

{% block content %}
  <article>
    {% include "partials/page-header.html" %}
    {% include "partials/post-list.html" %}
  </article>
{% endblock %}
```

Before the block content the layout sets three variables which are then used in the two partials. `title`, `content` and `pagination` come from a markdown file — created later.

Create the partial `page-header.html` to show the title and optionally the summary.

```njk
<h1>{{ pageHeaderTitle }}</h1>

{% if pageHeaderSummary %}
  <div>{{ pageHeaderSummary | safe }}</div>
{% endif %}
```

Create the partial `post-list.html` to optionally show a headline and the collection with a for loop.

```njk
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

Create `blog.md` to define the variables ysed by the layout and partials.

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

11ty creates a `pagination.items` collection. This is the value the feed layout passes to the list partial.

```njk
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

Create a partial `pagination.html` to link to show the different batches in the collection. Condition the markup to the presence of an anchor link pointing to the following or previous batch. 11ty adds `href` to the pagination object if necessary.

```njk
{% if pagination.href.next or pagination.href.previous %}
{/if}
```

For each link create an anchor link referencing the URL. For the previous link, for instance:

```njk
{% if pagination.href.previous %}
<a href="{{ pagination.href.previous }}{{ paginationAnchor }}">
  <span>{{ paginationPrevText if paginationPrevText else 'Previous' }}</span>
</a>
{% endif %}
```

In the `<span>` element inject the label from the chosen variable _or_ a default value with Nunjucks' ternary operator.

In the anchor link use the `href` provided in the pagination objct and the anchor defined in the front matter.

---

In the anchor link the `data-direction` attribute helps to improve accessibility by illustrating the navigation purpose.

```html
<a href="/backwards" data-direction="backwards">Previous</a>
<a href="/forwards" data-direction="forwards">Next</a>
```

---

Include the partial in the layout `feed.html` after the `<article>` element.

```njk
{% include "partials/pagination.html" %}
```

### Tags

To reiterate the concepts the lesson creates an additional page to show articles with a shared tag.

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

The tag page relies on the feed layout exactly as the blog page.

Update `feed.html` to handle the generic pagination, for `blog.md`, and the one devoted to the tag, `tag.md`.

If the markdown file defines a tag use the specific collection for the list of items.

```njk
{% if tag %}
  {% set postListItems = collections[tag] %}
  {% set pageHeaderTitle = 'Blog posts filed under “' + tag + '”' %}
{% endif %}
```

If the markdown file defines a tag skip the pagination partial.

```njk
{% if not tag %}
  {% include "partials/pagination.html" %}
{% endif %}
```

## Lesson 12: Blog post view, directory data and filters

The individual post in the `src/posts` folder are rendered as-is, but it is possible to rely on a dedicated layout file to include the content in a specific markup structure.

Create a layout `post.html` to render the content of the markdown files.

```njk
{% block content %}
  <article>
    {% include "partials/page-header.html" %}

    <div>{{ content | safe }}</div>
  </article>
{% endblock %}
```

In the block include content and the header's partial. For the header define `pageHeaderTitle` with the variable set in the markdown file.

```njk
{% set pageHeaderTitle = title %}
```

Again for the header set `pageHeaderSummary` to refer to a specific markup structure.

```njk
{% set pageHeaderSummary %}
  <time>...</time>
  <p>...</p>
{% endset %}
```

Nunjucks makes it possible to store the markup in the summary variable, which is then included in the `page-header` partial.

For the tags loop through the input array to generate a list of items.

```njk
{% for tag in tags %}
<li>
  <a href="/tag/{{ tag | slug }}/">#{{ tag | title | replace(' ', '') }}</a>
</li>
{% endfor %}
```

In the body of the anchor link use the `title` filter to create a capitalized version of the tag.

Use the `replace` filter to remove the whitespace.

For the `href` attribute use the `slug` filter to produce a lowercase label where spaces are replaced with hyphens — 'Design Thinking' becomes 'design-thinking'.

`slug`, `title` and `replace` are provided by 11ty and Nunjucks. Just like with collections, however, it is possible to create custom filters.

Create a folder `src/filters`.

Create `date-filter.js` and `w3-date-filter.js` to format a date object.

For `w3-date-filter.js` create and export a function to use the ISO string.

```js
module.exports = (value) => new Date(value).toISOString();
```

In the config file `.eleventy.js` require the filter and add the functionality through the `config` object.

```js
const w3DateFilter = require("./src/filters/w3-date-filter.js");

// config
config.addFilter("w3DateFilter", w3DateFilter);
```

Use the filter like other Nunjucks' filters.

```html
<time datetime="{{ date | w3DateFilter }}"></time>
```

For the `date-filter` repeat the process, but first install the `moment` library.

```bash
npm install moment
```

Use the `format` method to create a specific string.

```js
return `${dateObject.format("Do")} of ${dateObject.format("MMMM YYYY")}`;
```

To have the posts benefit from the layout file add a _directory data file_ in the same folder describing the markdown files.

Create `src/posts/posts.json` to describe the layout file.

```json
{
  "layout": "layouts/post.html"
}
```

11ty applies the layout file on any markdown document in the same repository which does not specify a separate layout.

With the permalink field create a page in the `/blog` route instead of `/posts`, the default 11ty uses considering the folder structure.

```json
{
  "layout": "layouts/post.html",
  "permalink": "/blog/{{ title | slug }}/index.html"
}
```

## Lesson 13: Recommended content

In `helpers.js` create and export a function which receives a collection, the current page, a number of articles and whether or not to pick the posts at random.

```js
getSiblingContent(collection, page, limit, random) {}
```

The `limit` is set by default to 3, while `random` is set by default to `true`.

```js
getSiblingContent(collection, page, limit = 3, random = true) {}
```

Based on this information create a collection of articles skipping the one in the current page.

```js
let filteredItems = collection.filter((d) => d.url !== page.url);
```

If choosing the article at random loop through the array backwards swapping the current item with a value present earlier in the collection.

Return the entire list or just the items described by the limit.

```js
if (limit > 0) {
  filteredItems = filteredItems.slice(0, limit);
}

return filteredItems;
```

In the post layout `post.html` set a variable to refer to the accompanying articles.

```njk
{% set recommendedPosts = helpers.getSiblingContent(collections.blog, page) %}
```

Use the variable to optionally show a footer and a list for the matching posts before the end of the `<article>` element.

```njk
{% if recommendedPosts %}
<footer>
  <!--  -->
</footer>
{% endif %}
```

Instead of creating a new list component use the `post-list.html` partial with the recommended posts in the `postListItems` variable.

```njk
{% set postListItems = recommendedPosts %}
{% set postListHeadline = "More from the blog" %}

{% include "partials/post-list.html" %}
```

## Lesson 14: Adding our about page

Create a new layout file in `about.html`. With this file extend the base layout, set a specific title and summary.

```njk
{% set pageHeaderTitle = title %}
{% set pageHeaderSummary = content %}

<!-- block content -->
{% include "partials/page-header.html" %}
```

Moreover, set a variable for a collection to show through a dedicated partial, `people.html`.

```njk
{% set peopleItems = collections.people %}

<!-- block content -->
{% if peopleItems %}
  {% include "partials/people.html" %}
{% endif %}
```

Create the partial `people.html` to show the collection with an ordered list and one image for each person.

```njk
<ol>
  {% for item in peopleItems %}
    <!-- list item -->
  {% endfor %}
</ol>
```

Update the configuration file to create a `people` collection.

```js
config.addCollection("people", (collection) => {
  return collection.getFilteredByGlob("./src/people/.md");
});
```

Sorts the person by `fileSlug` — the alphabetical order of the files without the extension.

```js
return collection
  .getFilteredByGlob("./src/people/.md")
  .sort((a, b) => (Number(a.fileSlug) > Number(b.fileSlug) ? 1 : -1));
```

Create the actual page `about.html` describing the title, layout and content.

```md
---
title: "About Issue 33"
layout: "layouts/about.html"
---

Wanna see...
```

With `permalink` describe a specific URL instead of the default `/about/index.html`.

```md
---
permalink: "/about-us/index.html"
---
```

## Lesson 15: Adding our work landing page

Create a layout file `work-landing.html` which extends the base layout and marks up the title and content received from a markdown file.

```njk
{% extends "layouts/base.html" %}

{% set pageHeaderTitle = title %}
{% set pageHeaderSummary = content %}
```

In the content block add a partial for the header and loop through a `work` collection to show the corresponding image.

```njk
{% for item in collections.work %}
  <figure>
    <img src="{{ item.data.hero.image }}" alt="{{ item.data.hero.imageAlt }}" />
  </figure>
{% endfor %}
```

The named collection was created in a previous lesson, [creating our first collection](#lesson-8-creating-our-first-collection).

Create a new page `work.md` detailing the title and layout file.

```md
---
title: "Our finest work"
layout: "layouts/work-landing.html"
---
```

## Lesson 16: Creating a work item page

Create a layout file `work-item.html` which extends the base layout. In the block of content describe an individual item from the work collection.

```njk
{% block content %}
  <h1>{{ title }}</h1>
  <p>{{ summary }}</p>
  <img src="{{ hero.image }}" alt="{{ hero.imageAlt }}" />
{% endblock %}
```

From the front matter inject the title, summary, hero image, but also the facts and images associated with two arrays: `keyFacts` and `gallery` arrays.

```njk
{% for item in keyFacts %}
{% endfor %}

{% for item in gallery %}
{% endfor %}
```

Before the end of the `<section>` element the idea is to show the people associated with the specific work.

Considering the markdown documents in the `src/work` folder notice the variable `team`.

```md
---
team: [1, 2, 5]
---
```

The integers refer to an identifier set on the different persons in the people collection.

```md
---
title: "Creative director"
key: 1
---
```

With this in mind the idea is to retrieve a refererence of the people associated to the project by filtering the people collection according to `team`.

Create a helper function to filter the input collection according to a set of keys.

```js
filterCollectionByKeys(collection, keys) {
  return collection.filter((d) => keys.includes(d.data.key));
},
```

In the layout file call the function on the people collection with the array of keys.

```js
helpers.filterCollectionByKeys(collections.people, team);
```

Store the list in a variable.

```njk
{% set peopleItems = helpers.filterCollectionByKeys(collections.people, team) %}
```

Use the value to optionally show the people through the `people` partial.

```njk
{% if peopleItems %}
  <h2>Meet the team behind this project</h2>
  {% include "partials/people.html" %}
{% endif %}
```

Add a data configuration file in `src/work/work.json` so that the markdown files rely on the layout.

```json
{
  "layout": "layouts/work-item.html"
}
```

## Lesson 17: Meta info, RSS feeds and module recap

For meta data create a partial `meta-info.html` to add meta elements in the `<head>` of the document.

```njk
<title>{{ pageTitle }}</title>
<link rel="canonical" href="{{ currentUrl }}" />
```

Set considering multiple configurations. For the title, for instance, initialize the variable with the input title and the site's name retrieved from `site.json`.

```html
{% set pageTitle = title + ' - ' + site.name %}
```

If the partial is used with a specific title override this value.

```html
{% if metaTitle %} {% set pageTitle = metaTitle %} {% endif %}
```

Include the partial in the base layout, removing the previous `<title>` element.

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

For the RSS feed install `@11ty/eleventy-plugin-rss`.

```bash
npm install @11ty/eleventy-plugin-rss
```

In `.eleventy.js` include the plugin in the configuration object.

```js
const rssPlugin = require("@11ty/eleventy-plugin-rss");

module.exports = (config) => {
  config.addPlugin(rssPlugin);
};
```

Update `site.json` to detail additional information on the author.

```json
{
  "authorName": "Issue 33",
  "authorEmail": "hi@piccalil.li"
}
```

To generate the feed create `rss.html` in the `src` folder to specify the necessary XML syntax.

```njk
---
title: "Issue 33 Blog"
summary: "A feed of the latest posts from our blog."
permalink: "/feed.xml"
---

<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
```

`permalink` works to render the RSS feed in the specific URL and with the `.xml` extension.

The `<feed>` tag points the Atom specification, followed in the properties argumenting the feed.

```xml
<title>{{ title }}</title>
<subtitle>{{ summary }}</subtitle>

{% for post in collections.blog %}
  <entry>
    <title>{{ post.data.title }}</title>
  </entry>
{% endfor %}
```

Update the base layout so that every page describes the RSS feed in the head of the document.

```njk
<link rel="alternate" type="application/rss+xml" href="{{ site.url }}/feed.xml" />
```

---

In the RSS feed the course includes two filters which are noted as deprecated in the [documentation of the plugin](https://www.11ty.dev/docs/plugins/rss/#deprecated-filters).

```diff
-{{ post.date | rssDate }}
+{{ post.date | dateToRfc3339 }}
```

```diff
-{{ collections.blog | rssLastUpdatedDate }}
+{{ collections.blog | getNewestCollectionItemDate | dateToRfc3339 }}
```

---

## Lesson 18: Setting up Gulp

Use Gulp to set up an asset pipeline, to convert source code and other files in the production build.

The website is scheduled to have three lines devoted to code, images and fonts respectively. For each line Gulp helps to process the files in the `dist` folder.

Install the task manager.

```bash
npm install gulp
```

In the root of the repository create a task file `gulpfile.js` and describe a first task.

```js
exports.default = () => {
  console.log("Hello world");
  return Promise.resolve();
};
```

The snippet returns a promise to let Gulp conclude the current task.

Run `npx gulp` to print out the message in the console.

## Lesson 19: Setting up Sass

Sass extends the CSS native language with a few helpful features.

### Gulp libraries

Install three libraries.

```bash
npm install gulp-clean-css gulp-sass@4.1.0 sass
```

---

Install `gulp-sass` 4.1.0 since later versions of the API introduce breaking changes.

Install `sass` to have the gulp library use the canonical version of Sass insteed of the version included in `gulp-sass`.

---

Create a `gulp-tasks` folder to keep track of the different tasks.

Create `sass.js` and require the libraries.

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

The goal is to conceptually divide the stylesheet files in two, critical and standard. Critical CSS is ultimately included inline in a `<style>` element, while standard CSS is added through a `<link>` tag.

Create `criticalStyles` to illustrate the critical files.

```js
const criticalStyles = [
  "critical.scss",
  "home.scss",
  "page.scss",
  "work-item.scss",
];
```

Create `calculateOutput` to consider the array and return the output location, `./dist/css` for standard, `./src_includes/css` for critical files.

```js
// Takes the arguments passed by `dest` and determines where the output file goes
const calculateOutput = ({ history }) => {
  let response = "./dist/css";
  const sourceFileName = /[^(/|\\)]*$/.exec(history[0])[0];

  if (criticalStyles.includes(sourceFileName)) {
    response = "./src/_includes/css";
  }

  return response;
};
```

Create and export a `sass` function to process `.scss` files in a sequence of operations.

```js
const sass = () => {
  return src("./src/scss/*.scss");
  //
};
```

In order:

1. use `gulp-sass` and the associated processor to convert Sass to valid CSS

   ```js
   .pipe(sassProcessor().on("error", sassProcessor.logError))
   ```

2. use `gulp-clean-css` to optimize the output

   ```js
     .pipe(
       cleanCSS(
         isProduction
           ? {
               level: 2,
             }
           : {}
       )
     )
   ```

3. use `dest` to locate the output in either the `./dist/css` or `./src/_includes/css` folder

   ```js
   .pipe(dest(calculateOutput, { sourceMaps: !isProduction }));
   ```

By default 11ty ignores the files described in `.gitignore`, including the output folders.

```.gitignore
dist
src/_includes/css
```

Update the configuration object to avoid this preference.

```js
config.setUseGitIgnore(false);
```

To avoid considering the folder devoted to node modules create a separate file in `.eleventyignore`.

```.eleventyignore
node_modules
```

### Gulp task

Update `gulpfile.js` to include the logic of the Sass functon.

```js
const sass = require("./gulp-tasks/sass");
```

With the task runner require two functions, `watch` and `parallel`.

```js
const { parallel, watch } = require("gulp");
```

With `watch` and a `watcher` helper function process the files every time the `.scss` documents change.

```js
const watcher = () => {
  watch("./src/scss/**/*.scss", { ignoreInitial: true }, sass);
};

exports.watch = watcher;
```

---

`exports.fn` is equivalent to `module.exports.fn`.

---

With `parallel` run the Sass function, and any task which follows the current lesson.

```js
const { parallel } = require("gulp");

exports.default = parallel(sass);
```

---

`exports.default.fn` describes the task run by default.

```bash
npx gulp
```

To run other tasks specify the name of the exported function.

```bash
npx gulp watch
```

---

### Node scripts

Install `concurrently` to run multiple commands together.

```bash
npm install concurrently
```

Update the node scripts to support `npm run start` and `npm run production`.

With the first command execute:

1. `npx gulp`

2. `concurrently \"npx gulp watch\" \"npx eleventy --serve\"`

With the second command set an environmental variable before running `npx gulp` and `npx eleventy`.

```bash
NODE_ENV=production npx gulp # && ...
```

The variable is picked up by the task to optimize the output in the `dist` folder.

### CSS

As per the previous section CSS is split between critical and standard. With this in mind create an `src/scss` folder.

Create a stylesheet `critical.scss` to import a reset file.

```scss
@import "reset";
```

Create `_reset.scss` to add global values for the entire application.

```scss
*,
*::before,
*::after {
  box-sizing: border-box;
}

// ...
```

---

Files beginning with an underscore are ignored by the compiler, but included through the `import` statement.

---

Update the base layout to include the critical stylesheet in the `<head>` of the document.

```njk
<style>
  {% include "css/critical.css" %}
</style>
```

Include additional and critical CSS with a separate variable.

```njk
{% if pageCriticalStyles %}
  {% for item in pageCriticalStyles %}
  <style>
    {% include item %}
  </style>
  {% endfor %}
{% endif %}
```

The snippet helps to add critical stylesheets from layout files, just by defining the variable.

Past the critical values repeat the operation for non-critical CSS, but through the `<link>` element. Include dedicated stylesheet files.

```njk
<link rel="stylesheet" href="/fonts/fonts.css" />
```

Include additional files with a dedicated variable.

```njk
{% if pageStylesheets %}
  {% for item in pageStylesheets %}
    <link rel="stylesheet" href="{{ item }}" />
  {% endfor %}
{% endif %}
```

---

In the `<link>` element the course introduces a _hash_ with the goal of using the value for caching purposes.

```html
<link rel="stylesheet" href="/fonts/fonts.css?{{ assetHash }}" />
```

Define the variable at the top of the base layout, using a random value for each production build.

```njk
{% set assetHash = global.random() %}
```

Define the helper function in `_data/global.js`. The goal is to return a random string to create a distinct hash for each build. A different hash helps to update the cache and avoid outdated CSS.

```js
module.exports = {
  random() {
    const segment = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return `${segment()}-${segment()}-${segment()}`;
  },
};
```

---

---

In the `<link>` element the course introduces the `media` and `onload` attributes as an optimization trick.

```njk
<link
  rel="stylesheet"
  href="/fonts/fonts.css?{{ assetHash }}"
  media="print"
  onload="this.media='all'"
/>
```

The `media` attribute set to `print` tells the browser not to prioritise the stylesheet unless printing. The `onload` attribute updates the media to eventually load the resources.

---

## Lesson 20: Setting up fonts

Install `get-google-fonts`.

```bash
npm install get-google-fonts
```

The library allows to automate the following:

1. grab the fonts served by Google fonts

2. store the fonts in the output folder

3. create a stylesheet which references the fonts

The goal is to ultimately complete the `<link>` element included in the previous lesson in the base layout.

```njk
<link rel="stylesheet" href="/fonts/fonts.css?{{ assetHash }}" />
```

Create a gulp task `fonts.js`.

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

The library downloads the asssets in `./dist/fonts` and imports them in `./fonts.css`.

For the fonts download the specific files through the `download` method.

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

In the `dist` folder the script populates the `fonts` sub-folder with the stylesheet.

```css
/* cyrillic-ext */
@font-face {
  font-family: "Literata";
  font-style: italic;
  font-weight: 400;
  src: url("./Literata-400-cyrillic-ext1.woff2") format("woff2");
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F,
    U+FE2E-FE2F;
}
/* ... */
```

Alongside the stylesheet the script adds the font files.

## Lesson 21: Setting up images

Install `gulp-imagemin`.

```bash
npm i gulp-imagemin@7.1.0
```

The library allows to process, optimize and distribute images.

---

Install `gulp-imagemin@7.1.0` since later versions introduce breaking changes.

---

Create a task `images.js`.

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
return src("./src/images/**/*");
```

First pass the images through the `imagemin` module.

```js
.pipe(imagemin())
```

The library processes the images with a processor and according to their format.

```js
imagemin([
  imagemin.mozjpeg({ quality: 60, progressive: true }),
  imagemin.optipng({ optimizationLevel: 5, interlaced: null }),
]);
```

Second store the processed files in the output folder.

```js
.pipe(dest("./dist/images"));
```

In `gulpfile.js` require the task and include its functionality in the watcher to consider changes in the `images` folder.

```js
watch("./src/images/**/*", { ignoreInitial: true }, images);
```

Add the task to the `parallel` function to also run the task alongside the lines dedicated to fonts and CSS.

```js
exports.default = parallel(images, fonts, sass);
```

As a visual confirmation the console highlights the gains obtained on the different images in terms of size.

```text
gulp-imagemin: Minified 27 images (saved 1.81 MB - 45.7%)
```

---

As images are processed through the gulp task it is no longer necessary to rely on the passthrough feature introduced in [lesson 5](#lesson-5-passthrough-basics).

```diff
-config.addPassthroughCopy("./src/images/");
```

---

## Lesson 22: Global CSS and design tokens

The course focuses on CSS through the [CUBE methodology](https://cube.fyi/).

[Download the starter files](https://piccalilli.s3.eu-west-2.amazonaws.com/eleventy-from-scratch/eleventy-from-scratch-front-end-build-starter-files.zip) and extract `scss` folder in the `src` directory.

Install `gorko` to complement the cited CUBE methodology.

```bash
npm install gorko
```

Include the library in the `critical.scss` stylesheet.

```scss
@import "config";
@import "../../node_modules/gorko/gorko.scss";
```

### Configuration

At high level the idea is to add a configuration file `_config.scss` which creates classes on the basis of `$gorko-*` variables.

Consider for instance `$gorko-colors`.

```scss
$gorko-colors: (
  'dark': #38445b,
  'dark-shade': #263147,
  'dark-glare': #505c73,
  // ...
}
```

With `$gorko-config` you describe how to create classes.

```scss
$gorko-config: (
  "bg": (
    "items": $gorko-colors,
    "output": "standard",
    "property": "background",
  ),
);
```

The library produces the classes using the key as a name, for each of the items defined in the respective property.

```css
.bg-dark {
  background: #38445b;
}
.bg-dark-shade {
  background: #263147;
}
.bg-dark-glare {
  background: #505c73;
}
```

The `output` field is set to either `standard` or `responsive`. In this last instance gorko produces as many sets of custom properties as there are breakpoints in the config file.

Consider for instance `$gorko-size-scale`, which introduces the perfect fourth scale.

```scss
$gorko-size-scale: (
  "300": $gorko-base-size * 0.75,
  "400": $gorko-base-size,
  "500": $gorko-base-size * 1.33,
);
```

In the configuration block the values are picked up in a `flow-space` utility.

```scss
$gorko-config: (
  "flow-space": (
    "items": $gorko-size-scale,
    "output": "responsive",
    "property": "--flow-space",
  ),
);
```

With `standard` the library would produce `.flow-space-300`, `.flow-space-400` and so forth. With `responsive` gorko looks at the breakpoints.

```scss
$gorko-config: (
  //
  "breakpoints":
    (
      "md": "(min-width: 37em)",
      "lg": "(min-width: 62em)",
    )
);
```

For each breakpoint the library produces media queries.

```css
@media (min-width: 37em) {
}

@media (min-width: 62em) {
}
```

In the media queries the library produces additional set of classes: `.md\:flow-space-300`, `.md\:flow-space-400` and so forth; `.lg\:flow-space-300`, `.lg\:flow-space-400` and so forth.

The back slash character works to escape the colon.

```css
.flow-space-300 {
  --flow-space: 1rem;
}
.md\:flow-space-300 {
  --flow-space: 1rem;
}
.lg\:flow-space-300 {
  --flow-space: 1rem;
}
```

The goal is to ultimately add the classes in the markup.

```html
<div class="flow-space-300 md:flow-space-400">
  <!--  -->
</div>
```

### Utilities and blocks

The `utilities` and `blocks` folders create additional classes to complement with the CUBE methodology.

`utilities` create classes such as `.wrapper` to horizontally center a container.

```scss
.wrapper {
  max-width: 70rem;
  padding: 0 get-size("500");
  margin-left: auto;
  margin-right: auto;
  position: relative;
}
```

With `get-size` gorko picks up the `500` from the size scale.

`blocks` provide classes such as `.definition-group` to create a grid container.

```scss
.definition-group {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: 0.5rem 1.5rem;
}
```

### Stylesheet

In the `scss` folder create stylesheet files for the individual pages.

Update `critical.scss` to use of some of the utilities provided by `gorko`. These utilities help to modify the appearance of the entire website in terms of spacing, color and sizes. Consider these global styles affecting the entire application.

```scss
body {
  background: get-color("light");
  color: get-color("dark-shade");
}
```

Past the global declarations import some of the blocks and utilities which are mean to be available in all pages.

```scss
@import "blocks/definition-group";
// ..

@import "utilities/dot-shadow";
// ..
```

## Lesson 23: Styling global blocks

> The lesson works to illustrate how to write CSS in the context of the CUBE methodology and the setup introduced [in lesson 22](#lesson-22-global-css-and-design-tokens)

Update the base layout to wrap the markup in a generic `<div>` container with a class of `site-wrap`. This helps with horizontal overflow.

```njk
<div class="site-wrap">
  <!-- ... -->
</div>
```

Before the end of the container add a footer with general information on the website.

```njk
<div class="site-wrap">
  <!-- site-head partial -->
  <!-- main content -->
  <footer>
    <!--  -->
  </footer>
</div>
```

To style the base layout create blocks in `src/scss/blocks`:

- with `_site-head.scss` style the header as a flex container to position the nested logo and anchor links side by side.

- with `_nav.scss` to show the links in the navigation side by side

- with `_site-foot.scss` increase the whitespace around the footer's elements

Include the declrations in the critical stylesheet so that the styles affect the website.

```scss
@import "blocks/site-head";
@import "blocks/nav";
@import "blocks/site-foot";
```

## Lesson 24: Styling the skip link

Create two blocks:

- with `_button.scss` style all elements with a class of `button`

- with `_skip-link.scss` specifically target the anchor link element which allows to skip the site header and move focus to the container with an id of `main-content`

---

In terms of CSS and Sass the `.button` block incorporates two notable features:

1. `@extend` adds the key-value pairs defined in other classes

   ```scss
   .button {
     @extend .radius;
   }
   ```

   In this instance the button is styled with rounded borders as per the `.radius` utility class

   ```scss
   .radius {
     border-radius: 0.25rem;
   }
   ```

2. `!import` forces the background and color properties on hover to have precedence over the values specified on buttons with a specific `data` attribute

The `skip-link` block includes CSS declarations to hide the element but from assistive technologies.

---

Include the declrations in the critical stylesheet so that the styles affect the website.

```scss
@import "blocks/button";
@import "blocks/skip-link";
```

## Lesson 25: Home page intro

---

The lesson updates the layout of the elements in the `.intro` container with CSS grid. For reference the markup is structured with three nested containers.

```html
<article class="intro">
  <div class="intro__header"></div>
  <div class="intro__content"></div>
  <div class="intro__media"></div>
</article>
```

---

Create a stylesheet `home.scss` to import the configuration and utilities from the gorko library.

```scss
@import "config";

$outputTokenCSS: false;

@import "../../node_modules/gorko/gorko.scss";
```

By setting `$outputTokenCSS` to false gorko does not create utility classes. Without this precaution the stylesheet would repeat the same classes produced in `critical.css`.

```css
@charset "UTF-8";
.bg-dark {
  background: #38445b;
}
.bg-dark-shade {
  background: #263147;
}
.bg-dark-glare {
  background: #505c73;
}
```

---

While the lesson uses `$outputTokenCSS` the flag is noted as being deprecated in favor of `$generate-utility-classes`.

```diff
-$outputTokenCSS: false;
+$generate-utility-classes: false;
```

---

Create a block `_intro.scss` which accommodates different layouts depending on the viewport width with CSS grid and the media queries produced by gorko.

Focusing on grid properties create a single column layout with four rows of an explicit size.

```scss
.intro {
  display: grid;
  grid-template-rows: get-size("700") minmax(0, 1fr) get-size("700") auto;
  grid-gap: get-size("500");

  > * {
    grid-column: 1;
  }
}
```

With `grid-column: 1` every direct children is included in a new row.

Position the content in the last row, sized `auto` to be as tall as the nested paragraph and anchor link.

```scss
&__content {
  grid-row: 4;
}
```

For the heading and image, so to have the two overlap, position the heading in the second row. Position the image across the first three rows.

```scss
&__header {
  grid-row: 2;
}

&__media {
  grid-row: 1/4;
}
```

With the explicit size of the first and third row the image is guaranteed to extend above and below the heading.

In the first media query change the layout to explicitly set two columns and four rows.

```css
grid-template-rows: get-size("500") auto auto auto;
grid-template-columns: minmax(15rem, 1fr) 2fr;
```

In this instance position the content in the first column and penultimate row

```scss
&__content {
  grid-row: 3/4;
  grid-column: 1;
}
```

Position the heading across the first row,

```scss
&__header {
  grid-column: 1/3;
}
```

Position the image in the last column and across all the available rows

```scss
&__media {
  grid-column: 2/3;
  grid-row: 1/5;
}
```

In the final media query change the layout to increase the size of the second column, the one devoted to the image.

```css
grid-template-columns: 1fr minmax(44rem, 1fr);
```

Size the image to have a maximum height.

```scss
&__media {
  height: 28rem;
}
```

Import the block in `home.scss`.

```scss
@import "blocks/intro";
```

Include the stylesheet in `home.html` through the `pageCriticalStyles` variable.

```njk
{% set pageCriticalStyles = ['css/home.css'] %}
```

As per the configuration in [lesson 19](#lesson-19-setting-up-sass) the stylesheet is included in the `<head>` element of the base layout.

```njk
{% if pageCriticalStyles %}
  {% for item in pageCriticalStyles %}
    <style>
      {% include item %}
    </style>
  {% endfor %}
{% endif %}
```

## Lesson 26: Home page panels

For the call to action import a block `cta.scss` in the critical stylesheet. This is to have the component included on every page.

```scss
@import "blocks/cta";
```

Create `_cta.scss` with grid properties only within the media query describing larger viewports.

For the medium breakpoint divide the width in 12 columns.

```css
grid-template-columns: repeat(12, 1fr);
```

Have the heading container span to cover the first nine columns.

```scss
&__heading {
  grid-column: 1/9;
}
```

Have the summary container on the second row, from column 12 to 5 in reverse order.

```scss
&__summary {
  grid-row: 2;
  grid-column: 12/5;
}
```

Have the action container occupy the third row, from column 3 to 12.

```scss
&__action {
  grid-row: 3;
  grid-column: 3/12;
}
```

For the large breakpoint consider a smaller number of columns for the summary and action.

```scss
&__summary {
  grid-column: 12/7;
}

&__action {
  grid-column: 6/12;
}
```

In terms of spacing the container adds a `margin-top` property through the `flow` utility.

```html
<div class="[ cta__inner ] [ flow ]"></div>
```

If grid properties are supported, however, this default is removed in favor of the gap provided by `grid-gap`.

```scss
@supports (display: grid) {
  > * {
    margin: 0;
  }
}
```

Beside the block import a utility to style the heading.

```scss
@import "utilities/headline";
```

Create `_headline.scss` as a utility to increase the size of the `.heading` element, particularly for large viewports.

For the section devoted to the featured work import a block in the stylesheet devoted to the home layout, `home.scss`.

```scss
@import "blocks/featured-work";
```

Create `_featured-work.scss` to position the elements in a grid, once again pending the breakpoints.

For the medium breakpoint position the elements in a 12 column grid, with the heading introducing the section spreading across the entirety of the first row.

```scss
grid-template-columns: repeat(12, 1fr);

&__intro {
  grid-column: 1/13;
  align-self: end;
}
```

For the images position each successive child elements in the first and second half of the container.

```scss
&__item {
  &:nth-child(odd) {
    grid-column: 1/8;
  }

  &:nth-child(even) {
    grid-column: 13/6;
  }
}
```

For the large breakpoint alternate the elements left and right in between two columns.

```scss
grid-template-columns: repeat(2, 1fr);

&__intro,
&__item {
  &:nth-child(odd) {
    grid-column: 1/7;
  }

  &:nth-child(even) {
    grid-column: 13/7;
  }
}
```

For the section devoted to the studio feed import a block in the stylesheet devoted to the home layout, `home.scss`.

```scss
@import "blocks/studio-feed";
```

Create `_studio-feed.scss` to position the elements in a row allowing for horizontal scroll.

```scss
.studio-feed {
  &__list {
    display: flex;
    overflow-x: auto;
  }
}
```

Force each image not to shrink through the `flex-shrink○ property.

```scss
> * {
  flex-shrink: 0;
}
```

## Lesson 27: Styling the blog

Before the blog create a block `_page-header.scss` to increase the padding around the elements with the corresponding class.

```scss
.page-header {
  padding: get-size("800") 0;
}
```

Import the blog in the critical stylesheet.

```scss
@import "blocks/page-header";
```

Past this declaration available to all routes, the blog consists of two pages — `feed.html` and `post.html`. In each of the layout files add a stylesheet through the `pageCriticalStyles` variable.

```html
{% set pageCriticalStyles = ["css/page.css"] %}
```

Create `page.scss` similarly to `home.scss`, essentially setting up the configuration for the gorko library and importing the blocks relevant to the page.

```scss
@import "blocks/post-list";
```

Create a block `_post-list.scss` to update the design of anchor the link elements pointing to the individual articles.

Create a block `_pagination.scss` to separate the two anchor links forwarding to newer and older posts respectively.

Create a block in `_page-content.scss` to style `blockquote` elements and manage the vertical rhythm of the articles.

Finally, import the different blocks from the stylesheet included in the layout files.

```scss
@import "blocks/post-list";
@import "blocks/pagination";
@import "blocks/page-content";
```

## Lesson 28: Styling the about page

For the about page create a utility `_auto-grid.scss` to position the images in a grid.

```scss
.auto-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--auto-grid-min-size, 16rem), 1fr)
  );
  grid-gap: var(--auto-grid-gap, get-size("500"));
}
```

By combining `auto-fill` with a variable size for the column, between a minimum and `16rem`, the container allocates the child elements in as many columns as allowed by the width of the element.

Import the utility in the critical stylesheet.

```scss
@import "utilities/auto-grid";
```

Past the grid container create a block `_people.scss` to increase the spacing between the images in the grid.

Create a block `_person.scss` to change the appearance of the image and the connected caption.

Import both blocks in the critical stylesheet.

```scss
@import "blocks/people";
@import "blocks/person";
```

## Lesson 29: Add a contact page

The contact page helps to reinforce the concepts introduced in the course and the asset pipeline.

Create a layout file `page.html` which extends the base layout and makes use of the `page.scss` stylesheet.

```njk
{% extends "layouts/base.html" %}

{% set pageCriticalStyles = ["css/page.css"] %}
```

In terms of content include the partial for the page header with a given title.

```njk
{% set pageHeaderTitle = title %}

<article>
  {% include "partials/page-header.html" %}
</article>
```

Past the partial add the content in a given markup structure.

```njk
<div>{{ content | safe }}</div>
```

Create the page `contact.md` to use the layout and define the variables.

```md
---
title: "Contact us"
layout: "layouts/page.html"
---

This is ...
```

## Lesson 30: Styling the work section

In the critical stylesheet import a utility to change the layout of `.gallery` containers.

```scss
@import "blocks/gallery";
```

Create the block `_gallery.scss` to position the nested child elements in a single column layout.

On larger viewports modify the `align-items` and `flex-direction` properties to position the children alternatively left and right.

Past the block, useful for the entirety of the application, create dedicated blocks for the page devoted to work items. Import these blocks from `work-item.scss`

```scss
@import "blocks/hero";
@import "blocks/key-facts";
```

In the stylesheet specify the same gorko configuration introducing the home or page stylesheet files.

Create the block `_hero.scss` to position the heading above a large image describing the work item.

Create the block `_key-facts` to increase the whitespace around the statistics.

Since the blocks are imported in the dedicated stylesheet, and not in the critical file, reference the file in `work-item.html`.

```njk
{% set pageCriticalStyles = ["css/work-item.css"] %}
```

## Lesson 31: Wrapping up

The lesson concludes the course focusing on a production-ready website.

### Meta images

Download [two static assets](https://piccalilli.s3.eu-west-2.amazonaws.com/eleventy-from-scratch/eleventy-from-scratch-meta-images.zip) and extract the images in the `src/images/meta` folder.

Update the partial `meta-info.html` to include the URL for the social image with a variable.

```njk
{% if not socialImage %}
  {% set socialImage = site.url + '/images/meta/social-share.png' %}
{% endif %}
```

The meta properties are already present and pending the `socialImage` variable, so that the snippet works to provide a default URL.

```njk
{% if socialImage %}
<meta name="twitter:card" content="summary_large_image" />
{% endif %}
```

Update the same partial to point to the icon through a `<link>` element.

```njk
<link rel="icon" href="/images/meta/favicon.svg" type="image/svg+xml" />
```

### HTML minifier

Minify the HTML output with `html-minifier` and an 11ty _transform_.

Install the node library.

```bash
npm install html-minifier
```

Create a folder `src/transforms`.

Create `html-min-transform.js` and export a function to minify only `html` files.

```js
const htmlmin = require("html-minifier");

module.exports = (value, outputPath) => {
  if (outputPath && outputPath.indexOf(".html") > -1) {
  }
};
```

Process the syntax with the installed module.

```js
return htmlmin.minify(value, {
  useShortDoctype: true,
  removeComments: true,
  collapseWhitespace: true,
  minifyCSS: true,
});
```

Outside out markup files return the value as-is.

```js
return value;
```

Require the transforming function in `eleventy.config.js`.

```js
const htmlMinTransform = require("./src/transforms/html-min-transform");
```

Add the transform only in the production build checking `process.env.NODE_ENV`.

```js
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  config.addTransform("htmlmin", htmlMinTransform);
}
```

To test the production build run two commands in the console:

- `npm run production`

- `cd dist && npx serve`

`serve` serves the website on localhost, where the source is minified.
