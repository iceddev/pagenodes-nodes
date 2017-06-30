'use strict';

module.exports = function (PN) {
  var _PN$components = PN.components,
      NameRow = _PN$components.NameRow,
      SearchTextRow = _PN$components.SearchTextRow;


  PN.nodes.registerType('midi in', {
    category: 'hardware',
    defaults: {
      name: { value: "" },
      deviceId: { value: "", required: false }
    },
    color: "#DDD",
    inputs: 0,
    outputs: 1,
    faChar: "&#xf001;", //music
    faColor: "black",
    label: function label() {
      return this.name || this.deviceId || "midi";
    },
    oneditprepare: function oneditprepare(a) {

      PN.searchField({
        name: 'deviceId',
        rpc: 'midi/listInputIDs'
      });
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(SearchTextRow, { name: 'deviceId', label: 'device id', icon: 'tag' }),
        React.createElement(NameRow, null),
        React.createElement(
          'div',
          { className: 'form-tips', id: 'node-form-row-description' },
          'Device ID is optional. If not specified, the first MIDI device found will be used.'
        )
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'Connects to a midi device.'
        ),
        React.createElement(
          'p',
          null,
          'Emits binary (Buffer) data recieved on the midi port.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'midi input node.'
      );
    }
  });

  PN.nodes.registerType('midi out', {
    category: 'hardware',
    defaults: {
      name: { value: "" },
      deviceId: { value: "", required: false }
    },
    color: "#DDD",
    inputs: 1,
    outputs: 0,
    faChar: "&#xf001;", //usb
    faColor: "black",
    align: "right",
    label: function label() {
      return this.name || this.deviceId || "midi";
    },
    oneditprepare: function oneditprepare(a) {

      PN.searchField({
        name: 'deviceId',
        rpc: 'midi/listOutputIDs'
      });
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(SearchTextRow, { name: 'deviceId', label: 'device id', icon: 'tag' }),
        React.createElement(NameRow, null),
        React.createElement(
          'div',
          { className: 'form-tips', id: 'node-form-row-description' },
          'Device ID is optional. If not specified, the first MIDI device found will be used.'
        )
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'Connects to a midi device.'
        ),
        React.createElement(
          'p',
          null,
          'Writes binary (Buffer) data directly to the device.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'midi Out'
      );
    }
  });
};