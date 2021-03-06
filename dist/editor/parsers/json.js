'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('json', {
    category: 'function',
    color: "#DEBD5C",
    defaults: {
      name: { value: "" },
      payload: { value: "payload", required: false },
      result: { value: "payload", required: false },
      payloadType: { value: "msg", required: false },
      resultType: { value: "msg", required: false }
    },
    inputs: 1,
    outputs: 1,
    faChar: "{",
    label: function label() {
      return this.name || "json";
    },
    oneditprepare: function oneditprepare() {
      PN.util.setupTypedPayload(this, ['msg', 'flow']);
      PN.util.setupTypedResult(this);
    },
    render: function render() {
      var _PN$components = PN.components,
          NameRow = _PN$components.NameRow,
          PayloadRow = _PN$components.PayloadRow,
          ResultRow = _PN$components.ResultRow;

      return React.createElement(
        'div',
        null,
        React.createElement(PayloadRow, null),
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
          'A function that parses the ',
          React.createElement(
            'code',
            null,
            'msg.payload'
          ),
          ' or another property to/from JSON, and places the result back into that property.'
        ),
        React.createElement(
          'p',
          null,
          'If the input is a object, the node converts that object into a String.'
        ),
        React.createElement(
          'p',
          null,
          'If the input is a String, the node parses the String into an object.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Parses/Stringifies JSON'
      );
    }
  });
};