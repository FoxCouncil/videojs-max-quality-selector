import videojs from 'video.js';
import './qualityButton.js';
import {version as VERSION} from '../package.json';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {};

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

    this.options = videojs.mergeOptions(defaults, options);

    this.qualityLevels = [];
    this.qualityLevelsIdx = 0;

    this.player.on('loadstart', this.handleMediaChange.bind(this));
    this.player.on('loadeddata', this.handleMediaChangeDone.bind(this));
    this.player.qualityLevels().on('addqualitylevel', this.handleQualityLevel.bind(this));
    this.player.qualityLevels().on('change', this.handleChange.bind(this));

    this.button = player.controlBar.addChild('QualityButton', {}, player.controlBar.children().length - 1);

    this.player.ready(() => {
      this.player.addClass('vjs-max-quality-selector');
    });
  }

  handleMediaChange(e) {
    this.qualityLevels = [];
    this.qualityLevelsIdx = 0;
  }

  handleMediaChangeDone(e) {
    this.button.items = this.qualityLevels;
    this.button.update();
  }

  handleChange(e) {
    const selQuality = this.qualityLevels.find(function(level) {
      return level.idx === e.selectedIndex;
    });

    this.button.$('.vjs-icon-placeholder').innerHTML = selQuality.dimensionMarketingName + '<sup>' + selQuality.dimensionEnglishName + '</sup> (' + selQuality.bitrateName + ')';
  }

  handleQualityLevel(e) {
    const ql = e.qualityLevel;
    const quality = {
      idx: this.qualityLevelsIdx++,
      id: ql.id,
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
      return 'VLQ';
    case 360:
      return 'LQ';
    case 480:
      return 'SD';
    case 720:
      return 'HD';
    case 1080:
      return 'FullHD';
    case 2160:
      return 'UltraHD';
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
}

// Define default values for the plugin's `state` object here.
MaxQualitySelector.defaultState = {};

// Include the version number.
MaxQualitySelector.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('maxQualitySelector', MaxQualitySelector);

export default MaxQualitySelector;
