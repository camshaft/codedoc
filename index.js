/**
 * Module dependencies
 */

var each = require('each');
var minstache = require('minstache');

module.exports = function(element, filter) {
  var bindings = JSON.parse(element.getAttribute('data-codedoc'));

  filter = filter || defaultFilter;

  var locals = {};

  each(bindings, function(key, selector) {
    var textarea = document.getElementById(selector);
    textarea.addEventListener('keyup', onchange, false);

    function onchange(event) {
      var value = textarea.value || textarea.innerHTML;
      filter(value, key, function(err, content) {
        if (err) console.error(err); // todo expose the error
        locals[key] = content;
        if (event) render();
      });
    }
    onchange();
  });

  var renderer = minstache.compile(element.text);

  var iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  iframe.className = element.className;
  element.parentNode.replaceChild(iframe, element);

  function render() {
    var out = renderer(locals);
    var preview = iframe.contentDocument || iframe.contentWindow.document;
    preview.open();
    preview.write(out);
    preview.close();
  }
  render();
};

function defaultFilter(content, key, fn) {
  fn(null, content);
}
