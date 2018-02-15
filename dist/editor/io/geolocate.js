'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('geolocate', {
    category: 'hardware',
    color: "lightblue",
    defaults: {
      name: { value: "" }
    },
    inputs: 1,
    outputs: 1,
    faChar: '&#xf0ac;', //globe
    fontColor: "darkblue",
    faColor: 'darkblue',
    label: function label() {
      return this.name || 'geolocate';
    },
    render: function render() {
      var NameRow = PN.components.NameRow;

      return React.createElement(NameRow, null);
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'This node gives the geolocation coordinates using the API from ',
          React.createElement(
            'a',
            { href: 'https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition' },
            'navigator.GeoLocation'
          ),
          '.'
        ),
        React.createElement(
          'p',
          null,
          'You can see the bulk of the location by looking at the msg.location. If you are using a debug mode, you can see this by looking at the entire msg object.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Returns the geolocation of your current device'
      );
    }
  });
};