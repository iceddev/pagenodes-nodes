'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('range', {
    color: "#E2D96E",
    category: 'function',
    defaults: {
      minin: { value: "", required: true, validate: PN.validators.number() },
      maxin: { value: "", required: true, validate: PN.validators.number() },
      minout: { value: "", required: true, validate: PN.validators.number() },
      maxout: { value: "", required: true, validate: PN.validators.number() },
      action: { value: "scale" },
      round: { value: false },
      name: { value: "" }
    },
    inputs: 1,
    outputs: 1,
    faChar: "&#xf125;", //crop
    label: function label() {
      return this.name || "range";
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
            { htmlFor: 'node-input-action' },
            React.createElement('i', { className: 'fa fa-dot-circle-o' }),
            ' ',
            React.createElement(
              'span',
              null,
              ' Action:'
            )
          ),
          React.createElement(
            'select',
            { id: 'node-input-action', style: { width: "70%", marginRight: "5px" } },
            React.createElement(
              'option',
              { value: 'scale' },
              'Scale msg.payload'
            ),
            React.createElement(
              'option',
              { value: 'clamp' },
              'Scale and limit to the target range'
            ),
            React.createElement(
              'option',
              { value: 'roll' },
              'Scale and wrap within the target range'
            )
          )
        ),
        React.createElement('br', null),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement('i', { className: 'fa fa-sign-in' }),
          ' ',
          React.createElement(
            'span',
            null,
            ' Map the input range:'
          )
        ),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement('label', null),
          React.createElement(
            'span',
            null,
            'from: '
          ),
          React.createElement('input', { type: 'text', id: 'node-input-minin', placeholder: 'e.g. 0', style: { width: "100px", marginRight: "5px" } }),
          React.createElement(
            'span',
            null,
            ' to: '
          ),
          React.createElement('input', { type: 'text', id: 'node-input-maxin', placeholder: 'e.g. 99', style: { width: "100px" } })
        ),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement('i', { className: 'fa fa-sign-out' }),
          ' ',
          React.createElement(
            'span',
            null,
            ' to the result range:'
          )
        ),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement('label', null),
          React.createElement(
            'span',
            null,
            'from: '
          ),
          React.createElement('input', { type: 'text', id: 'node-input-minout', placeholder: 'e.g. 0', style: { width: "100px", marginRight: "5px" } }),
          React.createElement(
            'span',
            null,
            ' to: '
          ),
          React.createElement('input', { type: 'text', id: 'node-input-maxout', placeholder: 'e.g. 255', style: { width: "100px" } })
        ),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement('input', { type: 'checkbox', id: 'node-input-round', style: { display: "inlineBlock", width: "auto", verticalAlign: "top", marginRight: "5px" } }),
          React.createElement(
            'label',
            { style: { width: "auto" }, htmlFor: 'node-input-round' },
            React.createElement(
              'span',
              null,
              'Round to the nearest integer?'
            )
          )
        ),
        React.createElement('br', null),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-name' },
            React.createElement('i', { className: 'fa fa-tag' }),
            React.createElement(
              'span',
              null,
              ' Name'
            )
          ),
          React.createElement('input', { type: 'text', id: 'node-input-name', placeholder: 'Name' })
        ),
        React.createElement('br', null),
        React.createElement(
          'div',
          { className: 'form-tips', id: 'node-tip' },
          React.createElement(
            'span',
            null,
            'This node ONLY works with numbers.'
          )
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
          'A simple function node to remap numeric input values to another scale.'
        ),
        React.createElement(
          'p',
          null,
          'Currently only does a linear scaling.'
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Note:'
          ),
          ' This only operates on ',
          React.createElement(
            'b',
            null,
            'numbers'
          ),
          '. Anything else will try to be made into a number and rejected if that fails.'
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'i',
            null,
            'Scale and limit to target range'
          ),
          ' means that the result will never be outside the range specified within the result range.'
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'i',
            null,
            'Scale and wrap within the target range'
          ),
          ' means that the result will essentially be a "modulo-style" wrap-around within the result range.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'A simple function node to remap numeric input values to another scale.'
      );
    }
  });
};