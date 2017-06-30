'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sensorTypes = require('../../shared/nodes/websensors');

var _require = require('lodash'),
    map = _require.map;

module.exports = function (PN) {
  var _PN$nodes$registerTyp;

  PN.nodes.registerType('web sensor', (_PN$nodes$registerTyp = {
    category: 'robotics',
    color: "#DA523F",
    defaults: {
      name: { value: "" },
      sensorType: { value: "AmbientLightSensor", requied: true }
    }
  }, _defineProperty(_PN$nodes$registerTyp, 'color', "#f6de1d"), _defineProperty(_PN$nodes$registerTyp, 'inputs', 0), _defineProperty(_PN$nodes$registerTyp, 'outputs', 1), _defineProperty(_PN$nodes$registerTyp, 'faChar', "&#xf0ac;"), _defineProperty(_PN$nodes$registerTyp, 'faColor', "black"), _defineProperty(_PN$nodes$registerTyp, 'label', function label() {
    return this.name || this.sensorType;
  }), _defineProperty(_PN$nodes$registerTyp, 'render', function render() {
    var _PN$components = PN.components,
        NameRow = _PN$components.NameRow,
        SelectRow = _PN$components.SelectRow;

    return React.createElement(
      'div',
      null,
      React.createElement(SelectRow, { name: 'sensorType', label: 'type', options: map(sensorTypes, function (name, type) {
          return [name, type];
        }) }),
      React.createElement(NameRow, null)
    );
  }), _defineProperty(_PN$nodes$registerTyp, 'renderHelp', function renderHelp() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'p',
        null,
        'This node uses the ',
        React.createElement(
          'a',
          { href: 'https://w3c.github.io/sensors/' },
          ' Web Sensor'
        ),
        ' API.',
        React.createElement('br', null),
        'In chrome, you may need to enable this flag: ',
        React.createElement(
          'a',
          { href: 'chrome://flags/#enable-generic-sensor' },
          'chrome://flags/#enable-generic-sensor'
        )
      )
    );
  }), _defineProperty(_PN$nodes$registerTyp, 'renderDescription', function renderDescription() {
    return React.createElement(
      'p',
      null,
      'AmbientLightSensor node'
    );
  }), _PN$nodes$registerTyp));
};