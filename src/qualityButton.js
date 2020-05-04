import videojs from 'video.js';

const MenuButton = videojs.getComponent('MenuButton');
const MenuItem = videojs.getComponent('MenuItem');
const Menu = videojs.getComponent('Menu');
const Dom = videojs.dom;

class QualityButton extends MenuButton {
  /**
   * QualityButton constructor
   *
   * @param {Player} player - videojs player instance
   * @param {Object} options - component options
   */
  constructor(player, options = { title: '4k' }) {
    super(player, options);
    this.items = [];
    this.addClass('vjs-max-quality-selector-button');
  }

  /**
  * Toggle the subtitle track on and off upon click
  */
  handleClick(_e) {}

  createMenu() {
    const menu = new Menu(this.player_, { menuButton: this });

    if (this.items) {
      for (let i = 0; i < this.items.length; i++) {
        const qualItem = this.items[i];

        let itemText = qualItem.dimensionMarketingName;

        if (qualItem.dimensionEnglishName !== 'N/A') {
          itemText += '<sup>' + qualItem.dimensionEnglishName + '</sup>';
        }

        itemText += ' (' + qualItem.bitrateName + ')';

        const qualityEl = Dom.createEl('li', {
          className: 'vjs-menu-item',
          innerHTML: itemText,
          tabIndex: -1
        });

        const qualityItemComponent = new MenuItem(this.player_, { el: qualityEl });

        menu.addItem(qualityItemComponent);
      }
    }

    return menu;
  }
}

videojs.registerComponent('QualityButton', QualityButton);

export default QualityButton;
