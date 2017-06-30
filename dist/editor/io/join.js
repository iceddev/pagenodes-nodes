'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('join', {
    category: 'function',
    color: "#E2D96E",
    defaults: {
      name: { value: "" },
      mode: { value: "auto" },
      build: { value: "string" },
      property: { value: "payload" },
      propertyType: { value: "msg" },
      key: { value: "topic" },
      joiner: { value: "\\n" },
      timeout: { value: "" },
      count: { value: "" }
    },
    inputs: 1,
    outputs: 1,
    faChar: "&#xf247;",
    label: function label() {
      return this.name || "join";
    },

    oneditprepare: function oneditprepare() {
      $("#node-input-mode").change(function (e) {
        var val = $(this).val();
        $(".node-row-custom").toggle(val === 'custom');
        $(".form-tips-auto").toggle(val === 'auto');
      });
      $("#node-input-build").change(function (e) {
        var val = $(this).val();
        $(".node-row-key").toggle(val === 'object');
        $(".node-row-joiner").toggle(val === 'string');
        $(".node-row-trigger").toggle(val !== 'auto');
        if (val === 'string') {
          $("#node-input-property").typedInput('types', ['msg']);
        } else {
          $("#node-input-property").typedInput('types', ['msg', { value: "full", label: "complete message", hasValue: false }]);
        }
      });
      $("#node-input-property").typedInput({
        typeField: $("#node-input-propertyType"),
        types: ['msg', { value: "full", label: "complete message", hasValue: false }]
      });
      $("#node-input-key").typedInput({
        types: ['msg', { value: "merge", label: "", hasValue: false }]
      });
      $("#node-input-build").change();
      $("#node-input-mode").change();
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
            null,
            React.createElement(
              'span',
              null,
              ' Mode'
            )
          ),
          React.createElement(
            'select',
            { id: 'node-input-mode', style: { width: "200px" } },
            React.createElement(
              'option',
              { value: 'auto' },
              'automatic'
            ),
            React.createElement(
              'option',
              { value: 'custom' },
              'manual'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'node-row-custom' },
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'label',
              null,
              React.createElement(
                'span',
                null,
                'Combine to'
              )
            ),
            React.createElement(
              'select',
              { id: 'node-input-build', style: { width: "200px" } },
              React.createElement(
                'option',
                { id: 'node-input-build-string', value: 'string' },
                'a String'
              ),
              React.createElement(
                'option',
                { value: 'array' },
                'an Array'
              ),
              React.createElement(
                'option',
                { value: 'object' },
                'a key/value Object'
              ),
              React.createElement(
                'option',
                { value: 'merged' },
                'a merged Object'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'form-row node-row-key' },
            React.createElement(
              'label',
              { style: { verticalAlign: "top", marginTop: "7px" } },
              React.createElement(
                'span',
                null,
                ' using'
              )
            ),
            React.createElement(
              'div',
              { style: { display: "inlineBlock" } },
              React.createElement('input', { type: 'text', id: 'node-input-key', style: { width: "300px" } }),
              React.createElement(
                'div',
                { style: { marginTop: "7px" } },
                'as the property key'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'form-row node-row-joiner' },
            React.createElement(
              'label',
              { htmlFor: 'node-input-joiner' },
              'Join using'
            ),
            React.createElement('input', { type: 'text', id: 'node-input-joiner', style: { width: "40px" } })
          ),
          React.createElement(
            'div',
            { className: 'form-row node-row-trigger' },
            React.createElement(
              'label',
              { style: { width: "auto" } },
              React.createElement(
                'span',
                null,
                ' Send the message:'
              )
            ),
            React.createElement(
              'ul',
              null,
              React.createElement(
                'li',
                { style: { height: "65px" } },
                React.createElement(
                  'label',
                  { style: { width: "280px" }, htmlFor: 'node-input-count' },
                  'After a fixed number of messages:'
                ),
                ' ',
                React.createElement('input', { id: 'node-input-count', placeholder: 'count', type: 'text' })
              ),
              React.createElement(
                'li',
                { style: { height: "65px" } },
                React.createElement(
                  'label',
                  { style: { width: "280px" }, htmlFor: 'node-input-timeout' },
                  'After a timeout following the first message:'
                ),
                ' ',
                React.createElement('input', { id: 'node-input-timeout', placeholder: 'seconds', type: 'text' })
              ),
              React.createElement(
                'li',
                { style: { height: "65px" } },
                React.createElement(
                  'label',
                  { style: { width: "auto", paddingTop: "6px" } },
                  React.createElement(
                    'span',
                    null,
                    ' After a message with the ',
                    React.createElement(
                      'code',
                      null,
                      'msg.complete'
                    ),
                    ' property set'
                  )
                )
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'form-tips form-tips-auto hide' },
          'This mode assumes this node is either paired with a ',
          React.createElement(
            'i',
            null,
            'split'
          ),
          ' node or the received messages will have a properly configured ',
          React.createElement(
            'code',
            null,
            'msg.parts'
          ),
          ' property.'
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
          'A function that joins the a sequence of messages into a single message.'
        ),
        React.createElement(
          'p',
          null,
          'When paired with the ',
          React.createElement(
            'b',
            null,
            'split'
          ),
          ' node, it will automatically join the messages to reverse the split that was performed.'
        ),
        React.createElement(
          'p',
          null,
          'The node can join either a specific property of each received message or, if the output type is not string, the entire message.'
        ),
        React.createElement(
          'p',
          null,
          'The type of the resulting message property can be:'
        ),
        React.createElement(
          'ul',
          null,
          React.createElement(
            'li',
            null,
            'a ',
            React.createElement(
              'b',
              null,
              'string'
            ),
            ' - created by joining the property of each message with the specified join character.'
          ),
          React.createElement(
            'li',
            null,
            'an ',
            React.createElement(
              'b',
              null,
              'array'
            ),
            '.'
          ),
          React.createElement(
            'li',
            null,
            'a ',
            React.createElement(
              'b',
              null,
              'key/value object'
            ),
            ' - created by using a property of each message to determine the key under which the required value is stored.'
          ),
          React.createElement(
            'li',
            null,
            'a ',
            React.createElement(
              'b',
              null,
              'merged object'
            ),
            ' - created by merging the property of each message under a single object.'
          )
        ),
        React.createElement(
          'p',
          null,
          'The other properties of the output message are taken from the last message received before the result is sent.'
        ),
        React.createElement(
          'p',
          null,
          'A ',
          React.createElement(
            'i',
            null,
            'count'
          ),
          ' can be set for how many messages should be received before generating the output message'
        ),
        React.createElement(
          'p',
          null,
          'A ',
          React.createElement(
            'i',
            null,
            'timeout'
          ),
          ' can be set to trigger sending the new message using whatever has been received so far.'
        ),
        React.createElement(
          'p',
          null,
          'If a message is received with the ',
          React.createElement(
            'b',
            null,
            'msg.complete'
          ),
          ' property set, the output message is sent.'
        ),
        React.createElement(
          'p',
          null,
          'The automatic behaviour relies on the received messages to have ',
          React.createElement(
            'b',
            null,
            'msg.parts'
          ),
          ' set. The split node generates this property, but can be manually created. It has the following properties:'
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
        'A function that joins the a sequence of messages into a single message.'
      );
    }
  });
};