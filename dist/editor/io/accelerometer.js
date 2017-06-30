'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('orientation', {
    category: 'hardware',
    color: "#DA523F",
    defaults: {
      name: { value: "" },
      refreshInterval: { value: "300", required: false }
    },
    inputs: 0,
    outputs: 1,
    faChar: "&#xf079;", //retweet
    fontColor: "#FFF",
    label: function label() {
      return this.name || 'orientation';
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },
    render: function render() {
      var _PN$components = PN.components,
          NameRow = _PN$components.NameRow,
          TextRow = _PN$components.TextRow;

      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'refreshInterval', label: 'Interval (ms)', icon: 'clock-o', placeholder: '300' }),
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
          React.createElement(
            'b',
            null,
            'This node will only work on devices with accelerometers'
          )
        ),
        React.createElement(
          'p',
          null,
          'This node uses the ',
          React.createElement(
            'a',
            { href: 'https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation' },
            'Device Orientation'
          ),
          ' API in order to find out the accelerometers on your mobile device.  You can use this for situations where you need to control a devices hardware from the movement of an accelerometer'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Accelerometer node'
      );
    }
  });
};