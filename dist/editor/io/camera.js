'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('camera', {
    category: 'hardware',
    color: "rgb(174, 174, 231)",
    defaults: {
      name: { value: "" },
      animated: { value: false }
    },
    inputs: 1,
    outputs: 1,
    faChar: '&#xf083;', //camera-retro
    label: function label() {
      return this.name || 'camera';
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },
    oneditprepare: function oneditprepare() {},
    render: function render() {
      var NameRow = PN.components.NameRow;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'form-row', id: 'node-animated' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-animated' },
            React.createElement('i', { className: 'fa fa-video-camera' }),
            React.createElement(
              'span',
              null,
              'Animated'
            )
          ),
          React.createElement('input', {
            type: 'checkbox',
            id: 'node-input-animated',
            style: { display: "inlineBlock", width: "auto", "verticalAlign": "top" } }),
          React.createElement(
            'label',
            {
              htmlFor: 'node-input-animated',
              style: { width: "70%" } },
            ' Gif'
          )
        ),
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
          'Attaches a base64 (dataURL) picture from your webcam to ',
          React.createElement(
            'code',
            null,
            'msg.image'
          ),
          '.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Uses webcam to take a picture'
      );
    }
  });
};