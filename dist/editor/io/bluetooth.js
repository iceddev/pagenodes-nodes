'use strict';

module.exports = function (PN) {
  var _PN$components = PN.components,
      NameRow = _PN$components.NameRow,
      TextRow = _PN$components.TextRow;


  PN.nodes.registerType('bluetooth in', {
    category: 'hardware',
    defaults: {
      name: { value: "" },
      characteristicId: { value: "", required: true },
      // connection: {type:"bluetooth-device", required: true}
      bleServiceId: { value: "", required: true }
    },
    color: "#0000CC",
    inputs: 0,
    outputs: 1,
    faChar: "&#xf294;", //bluetooth-b
    faColor: "#FFF",
    fontColor: "#FFF",
    label: function label() {
      return this.name || this.topic || "bluetooth";
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'bleServiceId', label: 'service', icon: 'gear' }),
        React.createElement(TextRow, { name: 'characteristicId', label: 'character...Id', icon: 'gear' }),
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
          'Connects to a Bluetooth Low Energy (BLE) peripheral.'
        ),
        React.createElement(
          'p',
          null,
          'Emits binary (Buffer) notifications recieved from the peripheral.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'bluetooth input node.'
      );
    }
  });

  PN.nodes.registerType('bluetooth out', {
    category: 'hardware',
    defaults: {
      name: { value: "" },
      characteristicId: { value: "", required: true },
      // connection: {type:"bluetooth-device", required: true},
      bleServiceId: { value: "", required: true }
    },
    color: "#0000CC",
    inputs: 1,
    outputs: 0,
    faChar: "&#xf294;", //bluetooth-b
    faColor: "#FFF",
    fontColor: "#FFF",
    align: "right",
    label: function label() {
      return this.name || this.topic || "bluetooth";
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'bleServiceId', label: 'service', icon: 'gear' }),
        React.createElement(TextRow, { name: 'characteristicId', label: 'char... Id', icon: 'gear' }),
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
          'Connects to a Bluetooth Low Energy (BLE) peripheral.'
        ),
        React.createElement(
          'p',
          null,
          'Writes binary (Buffer) data directly to the peripheral.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'bluetooth Out'
      );
    }
  });
};