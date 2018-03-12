'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('camera', {
    category: 'hardware',
    color: "rgb(174, 174, 231)",
    defaults: {
      name: { value: "" },
      animated: { value: false },
      result: { value: "image", required: false },
      resultType: { value: "msg", required: false }
    },
    inputs: 1,
    outputs: 1,
    faChar: '&#xf083;', //camera-retro
    label: function label() {
      return this.name || 'camera';
    },
    oneditprepare: function oneditprepare() {
      PN.util.setupTypedResult(this);
    },
    render: function render() {
      var _PN$components = PN.components,
          NameRow = _PN$components.NameRow,
          ResultRow = _PN$components.ResultRow;

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
        React.createElement(ResultRow, null),
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
        ),
        React.createElement(
          'p',
          null,
          'If Animated Gif is selected, you can specify a ',
          React.createElement(
            'code',
            null,
            'msg.options'
          ),
          ' object to configure the gif output. More configuration details here: ',
          React.createElement(
            'a',
            { href: 'https://github.com/yahoo/gifshot#options', target: '_blank' },
            'here'
          )
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