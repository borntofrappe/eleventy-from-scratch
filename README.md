# eleventy-from-scratch

With this repository I set out to learn [11ty](https://www.11ty.dev/) following the guidance of [Andy Bell](https://twitter.com/piccalilli_) and his course [Learn Eleventy From Scratch](https://learneleventyfromscratch.com).

There are approximately 30 lessons, to which I dedicate individual branches.

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
