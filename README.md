# eleventy-from-scratch

With this repository I set out to learn [11ty](https://www.11ty.dev/) following the guidance of [Andy Bell](https://twitter.com/piccalilli_) and his course [Learn Eleventy From Scratch](https://learneleventyfromscratch.com).

There are approximately 30 lessons, to which I dedicate individual branches.

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
