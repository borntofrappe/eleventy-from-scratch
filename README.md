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
