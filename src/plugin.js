import videojs from 'video.js';
import './qualityButton.js';
import {version as VERSION} from '../package.json';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {
  index: -1,
  autoMode: true,
  displayMode: 0,
  minHeight: 0,
  maxHeight: 0,
  levels: [],
  filterDuplicates: true,
  showSingleItemMenu: false,
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

    this.player.on('loadstart', this.handleMediaChange.bind(this));

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

    const enabledLevels = [];

    this.qualityLevels.forEach(function(obj, idx) {
      obj.isCurrent = false;
      if (self.qlInternal.levels_[obj.id].enabled) {
        enabledLevels.push(obj.id);
      }
    });

    // console.log(enabledLevels);

    this.options.autoMode = enabledLevels.length === this.qualityLevels.length;

    const selQuality = this.qualityLevels.find(function(level) {
      return level.id === self.selectedIndex;
    });

    if (selQuality === undefined) {
      this.button.hide();
      return;
    }

    selQuality.isCurrent = true;

    if (this.options.filterDuplicates) {
      this.qualityLevels.forEach(function(obj, idx) {
        if (obj.uniqueId === selQuality.uniqueId) {
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

  changeLevel(levelIndex) {
    const self = this;

    if (levelIndex < 0) {
      this.qlInternal.levels_.forEach(function(obj, idx) {
        if (self.options.minHeight !== 0 && obj.height >= self.options.minHeight || self.options.maxHeight !== 0 && obj.height <= self.options.maxHeight) {
          obj.enabled = true;
        } else {
          obj.enabled = true;
        }
      });
      this.update();
      return;
    }
    // TODO: support endpoints and same dimensions and different bitrates
    const selectedQuality = this.qualityLevels.find(x => x.id === levelIndex);

    this.qlInternal.levels_.forEach(function(obj, idx) {
      const qual = self.qualityLevels.find(x => x.id === idx);

      if (qual !== undefined) {
        obj.enabled = idx === levelIndex || (self.options.filterDuplicates && qual.uniqueId === selectedQuality.uniqueId);
      }
    });
    if (this.options.autoMode) {
      this.update();
    }
  }

  handleMediaChange(e) {
    this.qualityLevels = [];
  }

  handleChange(e) {
    // console.log(`Handling quality change: ${e.selectedIndex}`);
    this.selectedIndex = e.selectedIndex;
    this.update();
  }

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
      bitrateName: this.getReadableFileSizeString(ql.bitrate),
      isCurrent: false
    };

    this.qualityLevels.push(quality);
  }

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

  getDimensionMarketingName(width, height) {
    switch (height) {
    case 2160:
      return '4k';
    case 2304:
      return 'True 4k';
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

    let displayString = '';

    if (this.options.displayMode === 1) {
      displayString = qualityLevel.dimensionMarketingName;
    } else if (this.options.displayMode === 2) {
      displayString = qualityLevel.dimensionEnglishName;
    } else {
      displayString = qualityLevel.dimensionMarketingName + '<sup>' + qualityLevel.dimensionEnglishName + '</sup>';
    }

    if (this.options.autoMode && qualityLevel.isCurrent) {
      displayString = `Auto(${displayString})`;
    }

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
