'use strict';

module.exports = function (PN) {

  PN.nodes.registerType('buffer', {
    category: 'function', // the palette category
    color: "#DEBD5C", //light red
    defaults: { // defines the editable properties of the node
      name: { value: "" }, //  along with default values.
      payload: { value: "payload", required: false },
      result: { value: "payload", required: false },
      payloadType: { value: "msg", required: false },
      resultType: { value: "msg", required: false },
      encoding: { value: "utf8", required: true }
    },
    inputs: 1, // set the number of inputs - only 0 or 1
    outputs: 1, // set the number of outputs - 0 to n
    faChar: "&#223;", //Sharp S from German
    label: function label() {
      // sets the default label contents
      return 'buffer';
    },
    oneditprepare: function oneditprepare() {
      PN.util.setupTypedPayload(this, ['msg', 'flow']);
      PN.util.setupTypedResult(this);
    },
    render: function render() {
      var _PN$components = PN.components,
          NameRow = _PN$components.NameRow,
          SelectRow = _PN$components.SelectRow,
          PayloadRow = _PN$components.PayloadRow,
          ResultRow = _PN$components.ResultRow;

      return React.createElement(
        'div',
        null,
        React.createElement(PayloadRow, null),
        React.createElement(SelectRow, { name: 'encoding', icon: 'tasks', options: ['ascii', 'utf8', 'utf16le', 'base64', 'hex', 'dataUrl'] }),
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
          ' to/from a Buffer, and places the result back into the payload.'
        ),
        React.createElement(
          'p',
          null,
          'If the input is a Buffer object, the node parses the object into a String with encoding chosen from the configuration in the node, or specified in ',
          React.createElement(
            'code',
            null,
            'msg.encoding'
          ),
          '.'
        ),
        React.createElement(
          'p',
          null,
          'If the input is a String, the node parses the String into a Buffer object with encoding chosen from the configuration in the node, or specified in ',
          React.createElement(
            'code',
            null,
            'msg.encoding'
          ),
          '.'
        ),
        React.createElement(
          'p',
          null,
          'If the input is an Array, the node parses the Array into a Binary Buffer object.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Parses ',
        React.createElement(
          'code',
          null,
          'msg.payload'
        ),
        ' to/from a Buffer'
      );
    }
  });
};