'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('shape', {
    category: 'function',
    color: "rgb(174, 174, 231)",
    defaults: {
      name: { value: "" },
      shapeType: { value: "face", required: true }
    },
    inputs: 1,
    outputs: 1,
    faChar: '&#xf029;', //qrcode
    label: function label() {
      return this.name || this.shapeType;
    },
    render: function render() {
      var _PN$components = PN.components,
          NameRow = _PN$components.NameRow,
          SelectRow = _PN$components.SelectRow;

      return React.createElement(
        'div',
        null,
        React.createElement(SelectRow, { name: 'shapeType', label: 'shape type', icon: 'tag', options: [['face', 'face'], ['QR/bar code', 'barcode'], ['text', 'text']] }),
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
          'Find Faces, QR codes, or text in images.  The node looks for a ',
          React.createElement(
            'code',
            null,
            'msg.image'
          ),
          ' which is either an image data URL, or an ImageData object.'
        ),
        React.createElement(
          'p',
          null,
          'The results are placed onto ',
          React.createElement(
            'code',
            null,
            'msg.results'
          ),
          '.'
        ),
        React.createElement(
          'p',
          null,
          'This node makes use of the ',
          React.createElement(
            'a',
            { href: 'https://wicg.github.io/shape-detection-api', target: '_blank' },
            'Accelerated Shape Detection API'
          ),
          '.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Shape Detector Node'
      );
    }
  });
};