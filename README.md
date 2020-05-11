# videojs-max-quality-selector

![NPM Publish](https://github.com/FoxCouncil/videojs-max-quality-selector/workflows/NPM%20Publish/badge.svg)

A Videojs Plugin to help you list out resolutions and bit-rates from Live, Adaptive and Progressive streams.

![Screenshot1](https://i.imgur.com/ZB8R2JK.png)
![Screenshot2](https://i.imgur.com/MachweD.png)

## Table of Contents

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Options](#options)
  - [autoLabel `:string`](#autolabel-string)
  - [defaultQuality `:number`](#defaultquality-number)
  - [disableAuto `:boolean`](#disableauto-boolean)
  - [displayMode `:number`](#displaymode-number)
  - [filterDuplicateHeights `:boolean`](#filterduplicateheights-boolean)
  - [filterDuplicates `:boolean`](#filterduplicates-boolean)
  - [index `:number`](#index-number)
  - [labels `:Array|Object`](#labels-arrayobject)
  - [maxHeight `:number`](#maxheight-number)
  - [minHeight `:number`](#minheight-number)
  - [showBitrates `:boolean`](#showbitrates-boolean)
  - [showSingleItemMenu `:boolean`](#showsingleitemmenu-boolean)
  - [sort `:number`](#sort-number)
  - [sortEnabled `:boolean`](#sortenabled-boolean)
- [Usage](#usage)
  - [`<link>` & `<script>` Tag](#link--script-tag)
  - [Browserify/CommonJS](#browserifycommonjs)
  - [RequireJS/AMD](#requirejsamd)
- [Content Delivery Network (`CDN`)](#content-delivery-network-cdn)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
## Installation

---

```sh
npm install --save videojs-max-quality-selector
```

## Options

---

### autoLabel `:string`

> Default: `'Auto'`

This option lets you rename the string value that represents the auto bitrate selection system.

```js
var player = videojs('my-video');
player.maxQualitySelector({
  "autoLabel": 'ABR' // Change the label from 'Auto' (default) to 'ABR'.
});
```

### defaultQuality `:number`

This option lets you control which level of quality is selected first.

`0` = Default Behaviour (The default from playlist), `1` = Lowest (Start the video with the lowest quality stream selected), `2` = Highest (Start the video with the highest quality stream selected)

> Default: `0`

```js
var player = videojs('my-video');
player.maxQualitySelector({
  "defaultQuality": 2 // Make the video start playing at the highest quality possible
});
```

### disableAuto `:boolean`

This option disables the auto bitrate selection system and focuses on a single quality level.

> Default: `false`

```js
var player = videojs('my-video');
player.maxQualitySelector({
  "disableAuto": true // Turn off the auto bitrate selection system
});
```

### displayMode `:number`

This option lets you control how the default quality level is displayed to the screen.

`Note`: This option is ignored if you override the quality level with a label in DefaultOptions.labels

`0` = Both (Includes both the resolution, in height, and the quality marketing name), `1` = Resolution (Include just the resolution, in height), `2` = Name (Include just the quality marketing name)

> Default: `0`

```js
var player = videojs('my-video');
player.maxQualitySelector({
  "disableAuto": true // Turn off the auto bitrate selection system
});
```

### filterDuplicateHeights `:boolean`

This option enabled the filtering of duplicate quality levels when their height all match.

`Tip`: This is useful if you want to avoid showing different bitrates to users.

> Default: `true`

```js
var player = videojs('my-video');
player.maxQualitySelector({
  "filterDuplicateHeights": false // Turn off filtering of duplicate quality levels with different bitrates
});
```

### filterDuplicates `:boolean`

This option enabled the filtering of duplicate quality levels when their width, height, bitrate all match.

`Tip`: This is useful if you want to avoid showing different endpoints to users.

> Default: `true`

```js
var player = videojs('my-video');
player.maxQualitySelector({
  "filterDuplicateHeights": false // Turn off filtering of duplicate quality levels with different bitrates
});
```

### index `:number`

This option helps you position the button in the VideoJS control bar.

> Default: `-1`

```js
var player = videojs('my-video');
player.maxQualitySelector({
  "index": -2 // Put the button before the closed-captioning button.
});
```

### labels `:Array|Object`

This options lets you override the name of the listed quality levels.

`Tip`: Use `maxQualitySelector.getLevelNames();` output to find the ID to overwrite.

> Default: `[]`

```js
var player = videojs('my-video');

// Quick and useful if only a few contiguous quality levels
var labelsArray = [ 'High', 'Low' ];

// Useful if you need to specify labels in a sparce list
var labelsObject =  { 0: 'High', 8: 'Medium', 16: 'Low', 24: 'Super Low' };

player.maxQualitySelector({
  "labels": labelsArray | labelsObject
});
```

### maxHeight `:number`

This options lets you specify the maximum height resolution to show in the menu.

> Default: `0`

```js
var player = videojs('my-video');
player.maxQualitySelector({
  "maxHeight": 1080 // Do not list any resolutions larger than 1080p.
});
```

### minHeight `:number`

This options lets you specify the minimum height resolution to show in the menu.

> Default: `0`

```js
var player = videojs('my-video');
player.maxQualitySelector({
  "minHeight": 480 // Do not list any resolutions smaller than 480p.
});
```

### showBitrates `:boolean`

This option enables showing the bitrate in the button and menu.

> Default: `false`

```js
var player = videojs('my-video');
player.maxQualitySelector({
  "showBitrates": true // Turn on showing bitrates in the button and menu.
});
```

### showSingleItemMenu `:boolean`

This option enabled to show the menu even if there is only one quality level.

> Default: `false`

```js
var player = videojs('my-video');
player.maxQualitySelector({
  "showSingleItemMenu": true // Turn off hidding menu if there is only one quality level.
});
```

### sort `:number`

This option enables sorting direction the quality levels in the menu.

`0` = Descending (Qualities are listed from highest to lowest top down by height), `1` = Ascending (Qualities are listed from lowest to highest top down by height)

> Default: `0`

```js
var player = videojs('my-video');
player.maxQualitySelector({
  "sort": 1 // List the qualities from lowest to highest top down.
});
```

### sortEnabled `:boolean`

This option enables sorting the quality levels in the menu.

> Default: `true`

```js
var player = videojs('my-video');
player.maxQualitySelector({
  "sortEnabled": false // List the quality levels as they have been specified.
});
```

## Usage

---

To include videojs-max-quality-selector on your website or web application, use any of the following methods.

### `<link>` & `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<link src="//path/to/videojs-max-quality-selector.css" rel="stylesheet">
```

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

## Content Delivery Network (`CDN`)

---

>We're using [unpkg](https://unpkg.com/) to serve our files.
>https://unpkg.com/videojs-max-quality-selector/


## License

---

MIT. Copyright (c) Fox (onefox@gmail.com)
