codedoc
=======

bind editable elements to the contents of an iframe

Installation
------------

```sh
$ component install camshaft/codedoc
```

Usage
-----

```html
<textarea id="user-input"></textarea>
<script id="output" type="application/x-minstache" data-codedoc='{"content": "user-input"}'>
  <p>
    {{!content}}
  </p>
</script>
```

```js
var codedoc = require('codedoc');
codedoc(document.getElementById('output'));
```
