'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('image', {
    category: 'function',
    color: "rgb(174, 174, 231)",
    defaults: {
      name: { value: "" },
      operation: { value: "resize", required: true }
    },
    inputs: 1,
    outputs: 1,
    faChar: '&#xf03e;', //photo
    label: function label() {
      return this.name || this.operation;
    },
    render: function render() {
      var _PN$components = PN.components,
          NameRow = _PN$components.NameRow,
          SelectRow = _PN$components.SelectRow;

      return React.createElement(
        'div',
        null,
        React.createElement(SelectRow, { name: 'operation', label: 'operation', icon: 'tag', options: [['resize', 'resize'], ['crop', 'crop'], ['Get Image Data', 'getImageData'], ['To Data URL', 'dataToUrl']] }),
        React.createElement(NameRow, null)
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'Uses HTML Canvas to perform various image operations.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Image Operations Node'
      );
    }
  });
};