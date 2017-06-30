'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('split', {
    category: 'function',
    color: "#E2D96E",
    defaults: {
      name: { value: "" },
      splt: { value: "\\n" }
    },
    inputs: 1,
    outputs: 1,
    faChar: "&#xf248;",
    label: function label() {
      return this.name || "split";
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
            { htmlFor: 'node-input-splt' },
            React.createElement('i', { className: 'fa fa-scissors' }),
            ' ',
            React.createElement(
              'span',
              null,
              'Split'
            )
          ),
          React.createElement('input', { type: 'text', id: 'node-input-splt', placeholder: 'character to split strings on : e.g. \\n' })
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
          React.createElement('input', { type: 'text', id: 'node-input-name', placeholder: 'Name' })
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
          'A function that splits ',
          React.createElement(
            'code',
            null,
            'msg.payload'
          ),
          ' into multiple messages.'
        ),
        React.createElement(
          'p',
          null,
          'The behaviour is determined by the type of ',
          React.createElement(
            'code',
            null,
            'msg.payload'
          ),
          ':'
        ),
        React.createElement(
          'ul',
          null,
          React.createElement(
            'li',
            null,
            React.createElement(
              'b',
              null,
              'string'
            ),
            ' - a message is sent for each part of the string after it is split using the specified character, by default a newline.'
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'b',
              null,
              'array'
            ),
            ' - a message is sent for each element of the array'
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'b',
              null,
              'object'
            ),
            ' - a message is sent for each key/value pair of the object. ',
            React.createElement(
              'code',
              null,
              'msg.parts.key'
            ),
            ' is set to the key of the property.'
          )
        ),
        React.createElement(
          'p',
          null,
          'Each message is sent with the ',
          React.createElement(
            'code',
            null,
            'msg.parts'
          ),
          ' property set. This is an object that provides any subsequent ',
          React.createElement(
            'i',
            null,
            'join'
          ),
          ' node the necessary information for it to reassemble the messages back into a single one. The object has the following properties:'
        ),
        React.createElement(
          'ul',
          null,
          React.createElement(
            'li',
            null,
            React.createElement(
              'b',
              null,
              'id'
            ),
            ' - an identifier for the group of messages'
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'b',
              null,
              'index'
            ),
            ' - the position within the group'
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'b',
              null,
              'count'
            ),
            ' - the total number of messages in the group'
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'b',
              null,
              'type'
            ),
            ' - the type of message - string/array/object'
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'b',
              null,
              'ch'
            ),
            ' - for a string, the character used to split'
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'b',
              null,
              'key'
            ),
            ' - for an object, the key of the property this message was created from'
          )
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'A function that splits ',
        React.createElement(
          'code',
          null,
          'msg.payload'
        ),
        ' into multiple messages.'
      );
    }
  });
};