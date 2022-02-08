# eleventy-from-scratch

With this repository I set out to learn [11ty](https://www.11ty.dev/) following the guidance of [Andy Bell](https://twitter.com/piccalilli_) and his course [Learn Eleventy From Scratch](https://learneleventyfromscratch.com).

There are approximately 30 lessons, to which I dedicate individual branches.

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
