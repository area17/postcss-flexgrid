# PostCSS Flexgrid

[PostCSS](https://github.com/postcss/postcss) helpers for working with a flexible grid. Very early stage, you probably don't want to use this.

## Installation

```console
$ npm install --save-dev postcss-flexgrid
```

## Usage

```js
// dependencies
var fs = require("fs")
var postcss = require("postcss")
var flexgrid = require("postcss-flexgrid")

// css to be processed
var css = fs.readFileSync("input.css", "utf8")

var options = {
  max_columns: 12,  // Number of columns of the grid
  column_width: 70, // Width of one column, in pixels
  gutter_width: 30, // Width of a gutter, in pixels
};

// process css
var output = postcss()
  .use(flexgrid(options))
  .process(css)
  .css
```

```css
.container {
  span: 5;
}
.container .sub-container {
  span: 2 of 5;
}
.container .other-sub-container {
  span: 3 of 5;
  margin-right: 0;
}
```

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
