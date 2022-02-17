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
