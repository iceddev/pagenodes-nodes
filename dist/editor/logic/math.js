'use strict';

module.exports = function (PN) {

  PN.nodes.registerType('math', {
    category: 'function', // the palette category
    color: "#778899", //light gray
    defaults: { // defines the editable properties of the node
      name: { value: "" }, //  along with default values.
      operator: { value: "+", required: true },
      operand: { value: "", required: false },
      operandType: { value: "num", required: false },
      payloadProp: { value: "payload", required: false },
      resultProp: { value: "payload", required: false },
      payloadPropType: { value: "msg", required: false },
      resultPropType: { value: "msg", required: false }
    },
    inputs: 1, // set the number of inputs - only 0 or 1
    outputs: 1, // set the number of outputs - 0 to n
    faChar: "&#xf1ec;", //calculator
    label: function label() {
      return this.name || this.operator + ' ' + (this.operand || '');
    },
    oneditprepare: function oneditprepare() {
      PN.util.setupTypedText({ name: 'payloadProp', node: this, types: ['msg', 'flow', 'num', 'str'] });
      PN.util.setupTypedText({ name: 'resultProp', node: this, types: ['msg', 'flow'] });
      PN.util.setupTypedText({ name: 'operand', node: this, types: ['num', 'msg', 'flow', 'str'] });
    },
    render: function render() {
      var _PN$components = PN.components,
          NameRow = _PN$components.NameRow,
          TextRow = _PN$components.TextRow,
          TypeTextRow = _PN$components.TypeTextRow,
          SelectRow = _PN$components.SelectRow;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-operator' },
            React.createElement('i', { className: 'fa fa-tasks' }),
            ' ',
            React.createElement(
              'span',
              null,
              'Operator'
            )
          ),
          React.createElement(
            'select',
            { id: 'node-input-operator' },
            '// General options',
            React.createElement(
              'option',
              { value: '+' },
              'x + y'
            ),
            React.createElement(
              'option',
              { value: '-' },
              'x - y'
            ),
            React.createElement(
              'option',
              { value: '*' },
              'x * y'
            ),
            React.createElement(
              'option',
              { value: '/' },
              'x / y'
            ),
            React.createElement(
              'option',
              { value: '%' },
              'x modulo y'
            ),
            React.createElement(
              'option',
              { value: '^' },
              'x^y'
            ),
            React.createElement(
              'option',
              { value: 'log' },
              'log_x_(y)'
            ),
            React.createElement(
              'option',
              { value: 'round' },
              'round x'
            ),
            '// Special rounding options',
            React.createElement(
              'option',
              { value: 'floor' },
              'floor of x'
            ),
            React.createElement(
              'option',
              { value: 'ceil' },
              'ceiling of x'
            ),
            '// Trig Options',
            React.createElement(
              'option',
              { value: 'sin' },
              'sin(x)'
            ),
            React.createElement(
              'option',
              { value: 'cos' },
              'cos(x)'
            ),
            React.createElement(
              'option',
              { value: 'tan' },
              'tan(x)'
            ),
            React.createElement(
              'option',
              { value: 'csc' },
              'csc(x)'
            ),
            React.createElement(
              'option',
              { value: 'sec' },
              'sec(x)'
            ),
            React.createElement(
              'option',
              { value: 'cot' },
              'cot(x)'
            ),
            '// Reverse (r) applicable options',
            React.createElement(
              'option',
              { value: '-r' },
              'y - x'
            ),
            React.createElement(
              'option',
              { value: '/r' },
              'y / x'
            ),
            React.createElement(
              'option',
              { value: '%r' },
              'y modulo x'
            ),
            React.createElement(
              'option',
              { value: '^r' },
              'y^x'
            ),
            React.createElement(
              'option',
              { value: 'logr' },
              'log_y_(x)'
            ),
            React.createElement(
              'option',
              { value: 'roundr' },
              'round y'
            ),
            React.createElement(
              'option',
              { value: 'floorr' },
              'floor of y'
            ),
            React.createElement(
              'option',
              { value: 'ceilr' },
              'ceiling of y'
            ),
            React.createElement(
              'option',
              { value: 'sinr' },
              'sin(y)'
            ),
            React.createElement(
              'option',
              { value: 'cosr' },
              'cos(y)'
            ),
            React.createElement(
              'option',
              { value: 'tanr' },
              'tan(y)'
            ),
            React.createElement(
              'option',
              { value: 'cscr' },
              'csc(y)'
            ),
            React.createElement(
              'option',
              { value: 'secr' },
              'sec(y)'
            ),
            React.createElement(
              'option',
              { value: 'cotr' },
              'cot(y)'
            ),
            '// bitwise operators',
            React.createElement(
              'option',
              { value: 'AND' },
              'x AND y'
            ),
            React.createElement(
              'option',
              { value: 'OR' },
              'x OR y'
            ),
            React.createElement(
              'option',
              { value: 'XOR' },
              'x XOR y'
            ),
            React.createElement(
              'option',
              { value: 'NOT' },
              'NOT x'
            ),
            React.createElement(
              'option',
              { value: '<<' },
              'x << y'
            ),
            React.createElement(
              'option',
              { value: '>>' },
              'x >> y'
            ),
            '//trash',
            React.createElement(
              'option',
              { value: 'concat' },
              'string concat'
            )
          )
        ),
        React.createElement(TypeTextRow, { name: 'payloadProp', label: 'x', icon: 'cogs' }),
        React.createElement(TypeTextRow, { name: 'operand', label: 'y', icon: 'cogs', placeholder: 'Enter a number, \'pi\', or \'e\'' }),
        React.createElement(TypeTextRow, { name: 'resultProp', label: 'output', icon: 'arrow-up' }),
        React.createElement(NameRow, null),
        React.createElement(
          'div',
          { className: 'form-tips' },
          React.createElement(
            'span',
            null,
            'The ',
            React.createElement(
              'code',
              null,
              'x'
            ),
            ' value and ',
            React.createElement(
              'code',
              null,
              'result'
            ),
            ' value will default to the ',
            React.createElement(
              'code',
              null,
              'msg.payload'
            ),
            ' property if not specified.'
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
          'Allows various math operations that alter ',
          React.createElement(
            'code',
            null,
            'msg.payload'
          ),
          '.'
        ),
        React.createElement(
          'p',
          null,
          'The y value (or operand) can be stated in the node or, if left blank, can be set by ',
          React.createElement(
            'code',
            null,
            'msg.operand'
          ),
          '.'
        ),
        React.createElement(
          'p',
          null,
          'Likewise the radix for parsing the operand and payload can be set by ',
          React.createElement(
            'code',
            null,
            'msg.radix'
          ),
          ', or if not set will default to base ten.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Preforms various math operations'
      );
    }
  });
};