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
