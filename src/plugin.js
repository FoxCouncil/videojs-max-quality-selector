import videojs from 'video.js';
import './pluginButton.js';
import {version as VERSION} from '../package.json';

const Plugin = videojs.getPlugin('plugin');

/**
 * @constant
 * @kind class
 * @alias DefaultOptions
 */
const defaults = {
  /**
   * This option helps you position the button in the VideoJS control bar.
   *
   * @example
   * var player = videojs('my-video');
   * player.maxQualitySelector({
   *   'index': -2 // Put the button before the closed-captioning button.
   * });
   *
   * @member {number}
   * @default -1
   */
  index: -1,

  /**
   * This option lets you rename the string value that represents the auto bitrate selection system.
   *
   * @example
   * var player = videojs('my-video');
   * player.maxQualitySelector({
   *   'autoLabel': 'ABR' // Change the label from 'Auto' (default) to 'ABR'.
   * });
   *
   * @member {string}
   * @default 'Auto'
   */
  autoLabel: 'Auto',

  /**
   * This option lets you control which level of quality is selected first.
   *
   *     0: Default Behaviour (The default from playlist)
   *     1: Lowest (Start the video with the lowest quality stream selected)
   *     2: Highest (Start the video with the highest quality stream selected)
   *
   * @example
   * var player = videojs('my-video');
   * player.maxQualitySelector({
   *   'defaultQuality': 2 // Make the video start playing at the highest quality possible
   * });
   *
   * @member {number}
   * @default 0
   */
  defaultQuality: 0,

  /**
   * This option lets you control how the default quality level is displayed to the screen.
   * (Note: This option is ignored if you override the quality level with a label in {@link DefaultOptions.labels})
   *
   *     0: Both (Includes both the resolution, in height, and the quality marketing name)
   *     1: Resolution (Include just the resolution, in height)
   *     2: Name (Include just the quality marketing name)
   *
   * @example
   * var player = videojs('my-video');
   * player.maxQualitySelector({
   *   'displayMode': 1 // Only render out the height name of the video in the quality button and list
   * });
   *
   * @member {number}
   * @default 0
   */
  displayMode: 0,

  /**
   * This options lets you specify the minimum height resolution to show in the menu.
   *
   * @example
   * var player = videojs('my-video');
   * player.maxQualitySelector({
   *   'minHeight': 480 // Do not list any resolutions smaller than 480p.
   * });
   *
   * @member {number}
   * @default 0
   */
  minHeight: 0,

  /**
   * This options lets you specify the maximum height resolution to show in the menu.
   *
   * @example
   * var player = videojs('my-video');
   * player.maxQualitySelector({
   *   'maxHeight': 1080 // Do not list any resolutions larger than 1080p.
   * });
   *
   * @member {number}
   * @default 0
   */
  maxHeight: 0,

  /**
   * This options lets you override the name of the listed quality levels.
   *
   *     Tip: Use {@link MaxQualitySelector#getLevelNames} output to find the ID to overwrite.
   *
   * @example
   * var player = videojs('my-video');
   *
   * // Quick and useful if only a few contiguous quality levels
   * var labelsArray = [ 'High', 'Low' ];
   *
   * // Useful if you need to specify labels in a sparce list
   * var labelsObject =  { 0: 'High', 8: 'Medium', 16: 'Low', 24: 'Super Low' };
   *
   * player.maxQualitySelector({
   *   'labels': labelsArray | labelsObject
   * });
   *
   * @member {Array|Object}
   * @default []
   */
  labels: [],

  /**
   * This option disables the auto bitrate selection system and focuses on a single quality level
   *
   * @example
   * var player = videojs('my-video');
   * player.maxQualitySelector({
   *   'disableAuto': true // Turn off the auto bitrate selection system
   * });
   *
   * @member {boolean}
   * @default false
   */
  disableAuto: false,

  /**
   * This option enabled the filtering of duplicate quality levels when their *width*, *height*, *bitrate* all match.
   *
   *     Tip: This is useful if you want to avoid showing different endpoints to users.
   *
   * @example
   * var player = videojs('my-video');
   * player.maxQualitySelector({
   *   'filterDuplicates': false // Turn off filtering of duplicate quality levels
   * });
   *
   * @member {boolean}
   * @default true
   */
  filterDuplicates: true,

  /**
   * This option enabled the filtering of duplicate quality levels when their *height* all match.
   *
   *     Tip: This is useful if you want to avoid showing different bitrates to users.
   *
   * @example
   * var player = videojs('my-video');
   * player.maxQualitySelector({
   *   'filterDuplicateHeights': false // Turn off filtering of duplicate quality levels with different bitrates
   * });
   *
   * @member {boolean}
   * @default true
   */
  filterDuplicateHeights: true,

  /**
   * This option enabled to show the menu even if there is only one quality level.
   *
   * @example
   * var player = videojs('my-video');
   * player.maxQualitySelector({
   *   'showSingleItemMenu': true // Turn off hidding menu if there is only one quality level.
   * });
   *
   * @member {boolean}
   * @default false
   */
  showSingleItemMenu: false,

  /**
   * This option enables showing the bitrate in the button and menu.
   *
   * @example
   * var player = videojs('my-video');
   * player.maxQualitySelector({
   *   'showBitrates': true // Turn on showing bitrates in the button and menu.
   * });
   *
   * @member {boolean}
   * @default false
   */
  showBitrates: false,

  /**
   * This option enables sorting the quality levels in the menu.
   *
   * @example
   * var player = videojs('my-video');
   * player.maxQualitySelector({
   *   'sortEnabled': false // List the quality levels as they have been specified.
   * });
   *
   * @member {boolean}
   * @default true
   */
  sortEnabled: true,

  /**
   * This option enables sorting direction the quality levels in the menu.
   *
   *     0: Descending (Qualities are listed from highest to lowest top down by *height*)
   *     1: Ascending (Qualities are listed from lowest to highest top down by *height*)
   *
   * @example
   * var player = videojs('my-video');
   * player.maxQualitySelector({
   *   'sort': 1 // List the qualities from lowest to highest top down.
   * });
   *
   * @member {number}
   * @default 0
   */
  sort: 0
};

/**
 * A Videojs Plugin to help you list out resolutions and bit-rates from Live, Adaptive and Progressive streams.
 *
 * GitHub: {@link https://github.com/FoxCouncil/videojs-max-quality-selector}
 */
class MaxQualitySelector extends Plugin {

  /**
   * Create a MaxQualitySelector plugin instance. You generally should not ever need to call this manually,
   * however, if you do, make sure you pass a working player!
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object. See the {@link DefaultOptions}
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player, options);

    this.defaults = defaults;
    this.options = videojs.mergeOptions(defaults, options);

    this.log = videojs.log.createLogger('MaxQualitySelector');

    this.autoMode = true;
    this.qualityLevels = [];

    this.player.on('loadstart', this.handleMediaChange.bind(this));

    if (this.player.qualityLevels !== undefined) {
      this.qlInternal = this.player.qualityLevels();

      this.qlInternal.on('addqualitylevel', this.handleQualityLevel.bind(this));
      this.qlInternal.on('change', this.handleChange.bind(this));

      const buttonIndex = this.options.index < 0 ? player.controlBar.children().length + this.options.index : this.options.index;

      this.button = player.controlBar.addChild('MaxQualityButton', { parent: this }, buttonIndex);
    }

    this.player.ready(() => {
      this.player.addClass('vjs-max-quality-selector');
    });
  }

  /**
     * Run this to update the visual display of the plugin button with the current state.
     */
  update() {
    const self = this;

    const enabledLevels = [];

    this.qualityLevels.forEach(function(obj, idx) {
      obj.isCurrent = false;
      if (self.qlInternal.levels_[obj.id].enabled) {
        enabledLevels.push(obj.id);
      }
    });

    this.autoMode = enabledLevels.length === this.qualityLevels.length;

    const selQuality = this.qualityLevels.find(function(level) {
      return level.id === self.selectedIndex;
    });

    if (selQuality === undefined) {
      this.button.hide();
      return;
    }

    if (this.autoMode && this.options.disableAuto) {
      this.autoMode = false;
      this.changeLevel(selQuality.id);
    }

    selQuality.isCurrent = true;

    if (this.options.filterDuplicates) {
      this.qualityLevels.forEach(function(obj, idx) {
        if (obj.uniqueId === selQuality.uniqueId) {
          obj.isCurrent = true;
        }
      });
    }

    if (this.options.filterDuplicateHeights) {
      this.qualityLevels.forEach(function(obj, idx) {
        if (obj.height === selQuality.height) {
          obj.isCurrent = true;
        }
      });
    }

    this.button.$('.vjs-icon-placeholder').innerHTML = this.getQualityDisplayString(selQuality);

    this.button.show();

    let qualityItems = this.qualityLevels;

    if (this.options.sortEnabled) {
      if (this.options.sort === 0) {
        qualityItems = this.qualityLevels.sort(function(a, b) {
          return b.uniqueId - a.uniqueId;
        });
      } else {
        qualityItems = this.qualityLevels.sort(function(a, b) {
          return a.uniqueId - b.uniqueId;
        });
      }
    } else {
      qualityItems = this.qualityLevels.sort(function(a, b) {
        return a.id - b.id;
      });
    }

    this.button.items = qualityItems;
    this.button.update();
  }

  /**
     * Change the current quality level to a new one.
     *
     * @param {number} levelIndex The numeric index of the quality level to be chosen.
     */
  changeLevel(levelIndex) {
    const self = this;

    if (levelIndex < 0) {
      // Selecting AUTO
      this.qlInternal.levels_.forEach(function(obj, idx) {
        if (self.options.minHeight !== 0 && obj.height < self.options.minHeight || self.options.maxHeight !== 0 && obj.height > self.options.maxHeight) {
          obj.enabled = false;
        } else {
          obj.enabled = true;
        }
      });
      this.update();
      return;
    }

    const selectedQuality = this.qualityLevels.find(x => x.id === levelIndex);

    this.qlInternal.levels_.forEach(function(obj, idx) {
      const qual = self.qualityLevels.find(x => x.id === idx);

      if (qual !== undefined) {
        obj.enabled = idx === levelIndex ||
          (self.options.filterDuplicates && qual.uniqueId === selectedQuality.uniqueId) ||
          (self.options.filterDuplicateHeights && qual.height === selectedQuality.height);
      }
    });
    if (this.autoMode) {
      this.update();
    }
  }

  /**
     * Called by VideoJS when the player's source has changed.
     *
     * @param {Event} e The event object returned by VideoJS.
     */
  handleMediaChange(e) {
    this.log.debug('Handling media change:', this.player.src(), this.player.currentType());
    this.qualityLevels = [];
    this.update();
    if (this.options.defaultQuality !== 0) {
      this.firstRun = true;
    }
  }

  /**
     * Called by VideoJS-Contrib-Quality when the player's quality level has changed.
     *
     * @param {Event} e The event object returned by VideoJS-Contrib-Quality.
     */
  handleChange(e) {
    this.log.debug(`Handling quality change: ${e.selectedIndex}`);
    if (this.firstRun && this.options.defaultQuality !== 0) {
      this.firstRun = false;
      const levelPref = this.options.defaultQuality;

      if (levelPref === 1) {
        const quality = this.qualityLevels.reduce(function(res, obj) {
          return (obj.uniqueId < res.uniqueId) ? obj : res;
        });

        this.selectedIndex = quality.id;
        this.changeLevel(quality.id);
        this.update();
      } else {
        const quality = this.qualityLevels.reduce(function(res, obj) {
          return (obj.uniqueId > res.uniqueId) ? obj : res;
        });

        this.selectedIndex = quality.id;
        this.changeLevel(quality.id);
        this.update();
      }
    } else {
      this.selectedIndex = e.selectedIndex;
      this.update();
    }
  }

  /**
     * Called by VideoJS-Contrib-Quality when a new quality level has been added.
     *
     * @param {Event} e The event object returned by VideoJS-Contrib-Quality.
     */
  handleQualityLevel(e) {
    const ql = e.qualityLevel;

    if (ql.width === undefined || ql.height === undefined || ql.bitrate === undefined) {
      return;
    }

    if (this.options.minHeight !== 0 && ql.height < this.options.minHeight || this.options.maxHeight !== 0 && ql.height > this.options.maxHeight) {
      ql.enabled = false;
      return;
    }

    const uniqueId = ql.width + ql.height + ql.bitrate;

    const quality = {
      id: this.qlInternal.levels_.indexOf(ql),
      uniqueId,
      width: ql.width,
      height: ql.height,
      dimension: ql.width + 'x' + ql.height,
      dimensionEnglishName: this.getDimensionEnglishName(ql.width, ql.height),
      dimensionMarketingName: this.getDimensionMarketingName(ql.width, ql.height),
      bitrate: ql.bitrate,
      bitrateName: this.getReadableBitrateString(ql.bitrate),
      isCurrent: false
    };

    this.qualityLevels.push(quality);
  }

  /**
     * Get a list of the current quality levels in the plugin by true index.
     *
     *     Tip: Use this to help pin-point new {@Link DefaultOptions.labels} to apply to your button and menu.
     *
     * @return {Array} The array of level names as displayed by the plugin
     */
  getLevelNames() {
    const levelNames = [];

    this.qualityLevels.forEach(level => {
      levelNames.push(this.getQualityDisplayString(level));
    });

    return levelNames;
  }

  /**
     * Get a rendered name to a quality level, including overrides from the {@Link DefaultOptions.labels}.
     *
     * @param {number} id The true index of the quality level we want the name for
     * @param {string} originalName The fallback string to return if there is no customized level name label
     *
     * @return {string} Return the name if overwritten or the originalName.
     */
  getLevelName(id, originalName) {
    const labels = this.options.labels;

    if (labels[id] !== undefined) {
      return labels[id].toString();
    }

    return originalName;
  }

  /**
   * Get the dimension english name
   *
   * @param {number} [width] The quality width, not used
   * @param {number} height The quality height
   *
   * @return {string} Returns the dimension's english name.
   */
  getDimensionEnglishName(width, height) {
    switch (height) {
    case 108:
    case 180:
    case 144:
    case 234:
    case 240:
    case 252:
      return 'VLQ';
    case 360:
      return 'LQ';
    case 480:
    case 486:
    case 540:
      return 'SD';
    case 720:
      return 'HD';
    case 1080:
      return 'FHD';
    case 1440:
      return 'QHD';
    case 2160:
    case 2304:
      return 'UHD';
    }
    return 'N/A';
  }

  /**
   * Get the dimension marketing name
   *
   * @param {number} [width] The quality width, not used
   * @param {number} height The quality height
   *
   * @return {string} Returns the dimension's marketing name.
   */
  getDimensionMarketingName(width, height) {
    switch (height) {
    case 2160:
      return '4k';
    case 2304:
      return 'True 4k';
    }
    return height + 'p';
  }

  /**
   * Get the stringified view of the bitrate
   *
   * @param {number} bitrate The quality level bitrate to stringify
   *
   * @return {string} Returns a humanized version of a bitrate number
   */
  getReadableBitrateString(bitrate) {
    const byteUnits = [ ' Kbps', ' Mbps', ' Gbps' ];
    let i = -1;

    do {
      bitrate = bitrate / 1024;
      i++;
    } while (bitrate > 1024);

    const output = Math.max(bitrate, 0.1).toFixed(1);

    return output + byteUnits[i];
  }

  /**
   * Get the rendered string name for the quality level.
   *
   * @param {QualityLevel} qualityLevel The quality level to render to string
   *
   * @return {string} Returns the final display of the quality level
   */
  getQualityDisplayString(qualityLevel) {
    if (!qualityLevel) {
      return '';
    }

    let displayString = '';

    if (this.options.displayMode === 1) {
      displayString = qualityLevel.dimensionMarketingName;
    } else if (this.options.displayMode === 2) {
      displayString = qualityLevel.dimensionEnglishName;
    } else {
      displayString = qualityLevel.dimensionMarketingName + '<sup>' + qualityLevel.dimensionEnglishName + '</sup>';
    }

    if (this.autoMode && qualityLevel.isCurrent) {
      displayString = `${this.options.autoLabel}(${displayString})`;
    }

    if (this.options.showBitrates) {
      displayString += ' (' + qualityLevel.bitrateName + ')';
    }

    return this.getLevelName(qualityLevel.id, displayString);
  }
}

// Define default values for the plugin's `state` object here.
MaxQualitySelector.defaultState = {};

// Include the version number.
MaxQualitySelector.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('maxQualitySelector', MaxQualitySelector);

export default MaxQualitySelector;
