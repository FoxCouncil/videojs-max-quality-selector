import videojs from 'video.js';

const MenuButton = videojs.getComponent('MenuButton');
const MenuItem = videojs.getComponent('MenuItem');
const Menu = videojs.getComponent('Menu');
const Dom = videojs.dom;

// Default options for the plugin.
const defaults = {
  parent: null
};

class QualityButton extends MenuButton {

  /**
   * QualityButton constructor
   *
   * @param {Player} player - videojs player instance
   * @param {Object} options - component options
   */
  constructor(player, options) {

    super(player, options);

    this.options = videojs.mergeOptions(defaults, options);

    this.parent = this.options.parent;

    this.items = [];

    this.addClass('vjs-max-quality-selector-button');
  }

  /**
  * Toggle the subtitle track on and off upon click
  */
  handleMenuItemClick(e) {
    const selectedIndex = parseInt(e.currentTarget.dataset.id, 10);

    this.parent.changeLevel(selectedIndex);
  }

  createMenu() {
    const menu = new Menu(this.player_, { menuButton: this });

    if (this.items) {
      for (let i = 0; i < this.items.length; i++) {
        const qualItem = this.items[i];

        if (this.parent.options.filterDuplicates && !qualItem.isUnique) {
          continue;
        }

        const qualityEl = Dom.createEl('li', {
          className: 'vjs-menu-item',
          innerHTML: this.parent.getQualityDisplayString(qualItem),
          tabIndex: -1
        }, {
          'data-id': qualItem.idx
        });

        const qualityItemComponent = new MenuItem(this.player_, { el: qualityEl });

        qualityItemComponent.on('click', this.handleMenuItemClick.bind(this));

        menu.addItem(qualityItemComponent);
      }
    }

    return menu;
  }
}

videojs.registerComponent('QualityButton', QualityButton);

export default QualityButton;
