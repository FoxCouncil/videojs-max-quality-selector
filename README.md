# videojs-max-quality-selector

A Videojs Plugin to help you list out resolutions and bit-rates from Live, Adaptive and Progressive streams.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Usage](#usage)
  - [`<script>` Tag](#script-tag)
  - [Browserify/CommonJS](#browserifycommonjs)
  - [RequireJS/AMD](#requirejsamd)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
## Installation

```sh
npm install --save videojs-max-quality-selector
```

## Usage

To include videojs-max-quality-selector on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-max-quality-selector.min.js"></script>
<script>
  var player = videojs('my-video');

  player.maxQualitySelector();
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-max-quality-selector via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-max-quality-selector');

var player = videojs('my-video');

player.maxQualitySelector();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-max-quality-selector'], function(videojs) {
  var player = videojs('my-video');

  player.maxQualitySelector();
});
```

## License

MIT. Copyright (c) Fox (onefox@gmail.com)


[videojs]: http://videojs.com/
