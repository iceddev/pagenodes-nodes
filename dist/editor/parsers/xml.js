'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('xml', {
    category: 'function',
    color: "#DEBD5C",
    defaults: {
      name: { value: "" },
      propName: { value: "payload", required: true }
    },
    inputs: 1,
    outputs: 1,
    faChar: "&#xf1c9;",
    label: function label() {
      return this.name || "xml";
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
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
          ' or another property to/from XML, and places the result back into that property.'
        ),
        React.createElement(
          'p',
          null,
          'If the input is an object, the node converts that object into a XML String.'
        ),
        React.createElement(
          'p',
          null,
          'If the input is a XML String, the node parses the XML String into an object.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Parses/Stringifies XML'
      );
    }

  });
};