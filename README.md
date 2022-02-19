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
