/**
 * Module dependencies
 */

var each = require('each');
var minstache = require('minstache');

module.exports = function(element, filter, watch) {
  var bindings = JSON.parse(element.getAttribute('data-codedoc'));

  filter = filter || defaultFilter;
  watch = watch || defaultWatch;

  var locals = {
    closeScript: 'script'
  };

  each(bindings, function(key, selector) {
    watch(selector, onchange);

    function onchange(value) {
      if (value === false) return;
      filter(value, key, function(err, content) {
        if (err) console.error(err); // todo expose the error
        locals[key] = content;
        render();
      });
    }
    onchange(false);
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

function defaultWatch(selector, fn) {
  var textarea = document.getElementById(selector);
  textarea.addEventListener('keyup', function(event) {
    fn(textarea.value || textarea.innerHTML);
  }, false);
}

function defaultFilter(content, key, fn) {
  fn(null, content);
}
