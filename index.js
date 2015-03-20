var _ = require('lodash');

var options = {};
var defaults =  {
  max_columns: 12,
  column_width: 70, // in px
  gutter_width: 30, // in px
};

var flexGrid = function(columns, container_columns) {
  container_columns = container_columns || options.max_columns;
  var width = columns * options.column_width + (columns - 1) * options.gutter_width;
  var container_width = container_columns * options.column_width + (container_columns - 1) * options.gutter_width;
  return (width / container_width) * 100;
};

var flexGutter = function(container_columns, gutter){
  container_columns = container_columns || options.max_columns;
  gutter = gutter || options.gutter_width;
  var container_width = container_columns * options.column_width + (container_columns - 1) * options.gutter_width;
  return (gutter / container_width) * 100;
};


var flexGridProcessor = function(style, opts) {
  options = _.merge(options, defaults, opts);

  var asFunctionRE = /span\(\s*(\d+)\s*(?:of\s*(\d+)\s*)?\)/;
  var asValueRE = /\s*(\d+)\s*(?:of\s*(\d+)\s*)?/;
  style.eachDecl(function transformDecl(decl) {
    var cols,
        columns,
        container_columns,
        val;

    // Span as a value.
    // Examples:
    // width: span(<num>);
    // width: span(<num> of <num>);
    if (decl.value !== null && decl.value.indexOf('span(') !== -1) {
      cols = decl.value.match(asFunctionRE);
      columns = cols[1];
      container_columns = cols[2];
      decl.value = flexGrid(columns, container_columns) + '%';
    }

    // Span as a helper
    // Examples:
    // div {
    //   span: 5;
    //   span: 4 of 6;
    // }
    if (decl.prop === 'span') {
      cols = decl.value.match(asValueRE);
      columns = cols[1];
      container_columns = cols[2];
      decl.parent.append({prop: 'float', value: 'left'});
      decl.parent.append({prop: 'width', value: flexGrid(columns, container_columns) + '%'});
      decl.parent.append({prop: 'margin-right', value: flexGutter(container_columns) + '%'});
      decl.removeSelf();
    }

    // Add margins that are grid aware
    // Examples:
    // div {
    //   pre: 6;
    //   post: 6;
    //   pre: 4 of 10;
    //   post: 4 of 10;
    // }
    if (decl.prop === 'pre' || decl.prop === 'post') {
      cols = decl.value.match(asValueRE);
      columns = cols[1];
      container_columns = cols[2];
      val = flexGrid(columns, container_columns) + flexGutter(container_columns);
      decl.parent.append({prop: (decl.prop === 'pre' ? 'margin-left': 'margin-right'), value: val + '%'});
      decl.removeSelf();
    }

    // Helper that returns gutter width as a percentage value

    // This helper receives 2 parameters:
    // `container_columns` => Amount of columns of the container element
    // `gutter_width` => To override the main gutter width (Only if you know what you're doing)

    // Examples:
    // outerDiv {
    //   span: 6 of 12;
    // }
    // innerDiv {
    //   width: span(4);
    //   margin-left: gutter(6);
    // }
    if (decl.value !== null && decl.value.indexOf('gutter(') !== -1) {
      cols = decl.value.match(asValueRE);
      container_columns = cols && cols[1];
      gutter_width = cols && cols[2];
      decl.value = flexGutter(container_columns, gutter_width) + '%';
    }

  });


};


module.exports = flexGridProcessor;
