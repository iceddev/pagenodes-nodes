'use strict';

module.exports = function (PN) {

  PN.nodes.registerType('buffer', {
    category: 'function', // the palette category
    color: "#DEBD5C", //light red
    defaults: { // defines the editable properties of the node
      name: { value: "" }, //  along with default values.
      propName: { value: "payload", required: true },
      encoding: { value: "utf8", required: true }
    },
    inputs: 1, // set the number of inputs - only 0 or 1
    outputs: 1, // set the number of outputs - 0 to n
    faChar: "&#223;", //Sharp S from German
    label: function label() {
      // sets the default label contents
      return 'buffer';
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-propName' },
            React.createElement('i', { className: 'fa fa-circle' }),
            ' Property'
          ),
          'msg.',
          React.createElement('input', { type: 'text', style: { width: "208px" }, id: 'node-input-propName', placeholder: 'payload' })
        ),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-encoding' },
            React.createElement('i', { className: 'fa fa-tasks' }),
            ' ',
            React.createElement(
              'span',
              null,
              'Encoding'
            )
          ),
          React.createElement(
            'select',
            { id: 'node-input-encoding' },
            '// String encoding options',
            React.createElement(
              'option',
              { value: 'ascii' },
              'ascii'
            ),
            React.createElement(
              'option',
              { value: 'utf8' },
              'UTF-8 (default)'
            ),
            React.createElement(
              'option',
              { value: 'utf16le' },
              'UTF-16 LE (UCS-2)'
            ),
            React.createElement(
              'option',
              { value: 'base64' },
              'base64'
            ),
            React.createElement(
              'option',
              { value: 'hex' },
              'hex'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-name' },
            React.createElement('i', { className: 'fa fa-tag' }),
            ' ',
            React.createElement(
              'span',
              null,
              'Name'
            )
          ),
          React.createElement('input', { type: 'text', id: 'node-input-name' })
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