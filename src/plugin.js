import videojs from 'video.js';
import './qualityButton.js';
import {version as VERSION} from '../package.json';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {
  index: -1,
  filterDuplicates: true,
  showBitrates: false,
  sortEnabled: true,
  sort: 0
};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class MaxQualitySelector extends Plugin {

  /**
   * Create a MaxQualitySelector plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.defaults = defaults;
    this.options = videojs.mergeOptions(defaults, options);

    this.qualityLevels = [];
    this.qualityLevelsIdx = 0;
    this.qualityLevelFilter = [];

    this.player.on('loadstart', this.handleMediaChange.bind(this));
    this.player.on('loadeddata', this.handleMediaChangeDone.bind(this));

    if (this.player.qualityLevels !== undefined) {
      this.qlInternal = this.player.qualityLevels();

      this.qlInternal.on('addqualitylevel', this.handleQualityLevel.bind(this));
      this.qlInternal.on('change', this.handleChange.bind(this));

      this.button = player.controlBar.addChild('QualityButton', { parent: this }, player.controlBar.children().length - 1);
    }

    this.player.ready(() => {
      this.player.addClass('vjs-max-quality-selector');
    });
  }

  update() {
    const self = this;
    const selQuality = this.qualityLevels.find(function(level) {
      return level.idx === self.selectedIndex;
    });

    let displayQualityName = this.getQualityDisplayString(selQuality);

    if (displayQualityName === '') {
      displayQualityName = 'UNKNOWN';
    }

    this.button.$('.vjs-icon-placeholder').innerHTML = displayQualityName;

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
        return a.idx - b.idx;
      });
    }

    this.button.items = qualityItems;
    this.button.update();
  }

  changeLevel(levelIndex) {
    this.qlInternal.selectedIndex_ = levelIndex;
    this.qlInternal.trigger({ type: 'change', selectedIndex: levelIndex });
  }

  handleMediaChange(e) {
    this.qualityLevels = [];
    this.qualityLevelsIdx = 0;
    this.qualityLevelFilter = [];
  }

  handleMediaChangeDone(e) {
    this.update();
  }

  handleChange(e) {
    if (this.selectedIndex !== e.selectedIndex) {
      this.qlInternal.levels_.forEach(function(obj, idx) {
        obj.enabled = idx === e.selectedIndex;
      });
    }
    this.selectedIndex = e.selectedIndex;
    this.update();
  }

  handleQualityLevel(e) {
    const ql = e.qualityLevel;
    const qlUniqueId = ql.width + ql.height + ql.bitrate;
    let isUnique = true;

    if (this.qualityLevelFilter.includes(qlUniqueId)) {
      isUnique = false;
    } else {
      this.qualityLevelFilter.push(qlUniqueId);
    }

    const quality = {
      idx: this.qualityLevelsIdx++,
      id: ql.id,
      uniqueId: qlUniqueId,
      isUnique,
      label: ql.label,
      width: ql.width,
      height: ql.height,
      dimension: ql.width + 'x' + ql.height,
      dimensionEnglishName: this.getDimensionEnglishName(ql.width, ql.height),
      dimensionMarketingName: this.getDimensionMarketingName(ql.width, ql.height),
      bitrate: ql.bitrate,
      bitrateName: this.getReadableFileSizeString(ql.bitrate)
    };

    this.qualityLevels.push(quality);
  }

  getDimensionEnglishName(width, height) {
    switch (height) {
    case 240:
    case 252:
      return 'VLQ';
    case 360:
      return 'LQ';
    case 480:
    case 486:
      return 'SD';
    case 720:
      return 'HD';
    case 1080:
      return 'FHD';
    case 1440:
      return 'QHD';
    case 2160:
      return 'UHD';
    }
    return 'N/A';
  }

  getDimensionMarketingName(width, height) {
    switch (height) {
    case 2160:
      return '4k';
    }
    return height + 'p';
  }

  getReadableFileSizeString(fileSizeInBytes) {
    const byteUnits = [' Kbps', ' Mbps', ' Gbps'];
    let i = -1;

    do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
    } while (fileSizeInBytes > 1024);
    const output = Math.max(fileSizeInBytes, 0.1).toFixed(1);
    // output = Math.ceil(output / 10) * 10;

    return output + byteUnits[i];
  }

  getQualityDisplayString(qualityLevel) {
    if (!qualityLevel) {
      return '';
    }

    let displayString = qualityLevel.dimensionMarketingName + '<sup>' + qualityLevel.dimensionEnglishName + '</sup>';

    if (this.options.showBitrates) {
      displayString += ' (' + qualityLevel.bitrateName + ')';
    }
    return displayString;
  }
}

// Define default values for the plugin's `state` object here.
MaxQualitySelector.defaultState = {};

// Include the version number.
MaxQualitySelector.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('maxQualitySelector', MaxQualitySelector);

export default MaxQualitySelector;
