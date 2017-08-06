'use strict';

module.exports = function (PN) {
  var _PN$components = PN.components,
      NameRow = _PN$components.NameRow,
      TextRow = _PN$components.TextRow,
      SearchTextRow = _PN$components.SearchTextRow;


  PN.nodes.registerType('serial in', {
    category: 'hardware',
    defaults: {
      name: { value: "" },
      connection: { type: "serial-port", required: true }
    },
    color: "BurlyWood",
    inputs: 0,
    outputs: 1,
    faChar: "&#xf287;", //usb
    label: function label() {
      return this.name || this.topic || "serial";
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'connection', icon: 'globe' }),
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
          'Connects to a webusb, serial, or tcp port.'
        ),
        React.createElement(
          'p',
          null,
          'Emits binary (Buffer) data recieved on the port.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'serial input node.'
      );
    }
  });

  PN.nodes.registerType('serial out', {
    category: 'hardware',
    defaults: {
      name: { value: "" },
      topic: { value: "", required: false },
      connection: { type: "serial-port", required: true }
    },
    color: "BurlyWood",
    inputs: 1,
    outputs: 0,
    faChar: "&#xf287;", //usb
    align: "right",
    label: function label() {
      return this.name || this.topic || "serial";
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'connection', icon: 'globe' }),
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
          'Connects to a webusb, serial, or tcp port.'
        ),
        React.createElement(
          'p',
          null,
          'Writes binary (Buffer) data directly to the port.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'serial Out'
      );
    }
  });
};