# eleventy-from-scratch

With this repository I set out to learn [11ty](https://www.11ty.dev/) following the guidance of [Andy Bell](https://twitter.com/piccalilli_) and his course [Learn Eleventy From Scratch](https://learneleventyfromscratch.com).

There are approximately 30 lessons, to which I dedicate individual branches.

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
