import videojs from 'video.js';

const MenuButton = videojs.getComponent('MenuButton');
const MenuItem = videojs.getComponent('MenuItem');
const Menu = videojs.getComponent('Menu');
const Dom = videojs.dom;

// Default options for the plugin.
const defaults = {
  parent: null
};

class MaxQualityButton extends MenuButton {

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

  handleMenuItemClick(e) {
    const selectedIndex = parseInt(e.currentTarget.dataset.id, 10);

    this.parent.changeLevel(selectedIndex);
  }

  handleSubmenuKeyPress(e) {
    if (e.currentTarget.dataset.id === undefined) {
      return;
    }

    const selectedIndex = parseInt(e.currentTarget.dataset.id, 10);

    this.parent.changeLevel(selectedIndex);
  }

  createButton(menu, cssClass, text, id) {
    const buttonEl = Dom.createEl('li', {
      className: cssClass,
      innerHTML: text,
      tabIndex: -1
    }, {
      'data-id': id
    });

    const menuItem = new MenuItem(this.player_, { el: buttonEl });

    menuItem.on('click', this.handleMenuItemClick.bind(this));

    menu.addItem(menuItem);
  }

  createMenu() {
    const menu = new Menu(this.player_, { menuButton: this });
    const uniqueEntries = [];
    const uniqueHeights = [];

    if (this.items) {
      if (!this.parent.autoMode && !this.parent.options.disableAuto) {
        this.createButton(menu, 'vjs-menu-item', this.parent.options.autoLabel, -1);
      }

      for (let i = 0; i < this.items.length; i++) {
        const quality = this.items[i];

        if (this.parent.options.filterDuplicates && uniqueEntries.includes(quality.uniqueId)) {
          continue;
        } else {
          uniqueEntries.push(quality.uniqueId);
        }

        if (this.parent.options.filterDuplicateHeights && uniqueHeights.includes(quality.height)) {
          continue;
        } else {
          uniqueHeights.push(quality.height);
        }

        let elClass = 'vjs-menu-item';

        elClass += quality.isCurrent ? ' vjs-selected' : '';

        this.createButton(menu, elClass, this.parent.getQualityDisplayString(quality), quality.id);
      }

      if (!this.parent.options.showSingleItemMenu && menu.children_.length === 1) {
        return new Menu(this.player_, { menuButton: this });
      }
    }

    return menu;
  }
}

videojs.registerComponent('MaxQualityButton', MaxQualityButton);

export default MaxQualityButton;
