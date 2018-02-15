'use strict';

var _require = require('../../shared/nodes/strings'),
    stringFunctions = _require.stringFunctions,
    addCustomFunctions = _require.addCustomFunctions;

var _ = require('lodash');
addCustomFunctions(_);

module.exports = function (PN) {

  PN.nodes.registerType('strings', {
    category: 'function', // the palette category
    color: "#66d9ef", // yellow like other function nodes
    defaults: { // defines the editable properties of the node
      name: { value: "" }, //  along with default values.
      func: { value: "camelCase", required: true },
      param2: { value: "", required: false },
      param2Type: { value: "str", required: false },
      param3: { value: "", required: false },
      param3Type: { value: "str", required: false },
      payload: { value: "payload", required: false },
      result: { value: "payload", required: false },
      payloadType: { value: "msg", required: false },
      resultType: { value: "msg", required: false }
    },
    inputs: 1, // set the number of inputs - only 0 or 1
    outputs: 1, // set the number of outputs - 0 to n
    faChar: "&#xf0cc;", // 's' text icon
    label: function label() {
      return this.name || this.func;
    },
    oneditprepare: function oneditprepare() {

      PN.util.setupTypedPayload(this);
      PN.util.setupTypedResult(this);
      PN.util.setupTypedText({ name: 'param2', node: this, types: ['str', 'num', 'bool', 'json', 'msg', 'flow'] });
      PN.util.setupTypedText({ name: 'param3', node: this, types: ['str', 'num', 'bool', 'json', 'msg', 'flow'] });

      var myFuncDef = stringFunctions[this.func];

      function handleFunc(functionDef) {
        $("#node-div-param2Row").hide();
        $("#node-div-param3Row").hide();
        functionDef.forEach(function (param) {
          console.log("param", param);
          if (param.param2) {
            $("#node-label-param2").html(' ' + param.param2);
            $("#node-div-param2Row").show();
          }
          if (param.param3) {
            $("#node-label-param3").html(' ' + param.param3);
            $("#node-div-param3Row").show();
          }
        });
      }

      handleFunc(myFuncDef);

      var funcInput = $("#node-input-func");
      funcInput.change(function () {
        console.log('funcInput changed', this.value);
        handleFunc(stringFunctions[this.value]);
      });
    },
    render: function render() {
      var _PN$components = PN.components,
          NameRow = _PN$components.NameRow,
          TextRow = _PN$components.TextRow,
          TypeTextRow = _PN$components.TypeTextRow,
          SelectRow = _PN$components.SelectRow,
          PayloadRow = _PN$components.PayloadRow,
          ResultRow = _PN$components.ResultRow;

      var funcNames = _.keys(stringFunctions).sort();
      return React.createElement(
        'div',
        null,
        React.createElement(PayloadRow, null),
        React.createElement(SelectRow, { name: 'func', icon: 'gears', options: funcNames }),
        React.createElement(TypeTextRow, { name: 'param2', icon: 'crosshairs' }),
        React.createElement(TypeTextRow, { name: 'param3', icon: 'crosshairs' }),
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
          'Provides ',
          React.createElement(
            'i',
            null,
            React.createElement(
              'a',
              { href: 'https://lodash.com/docs#camelCase', target: '_new' },
              'Lodash'
            )
          ),
          ' string functions that use ',
          React.createElement(
            'code',
            null,
            'msg.payload'
          ),
          ' as the first parameter.'
        ),
        React.createElement(
          'p',
          null,
          'Other paramters beyond the first can be input in this node\'s configuration.'
        ),
        React.createElement(
          'p',
          null,
          'You may also attach ',
          React.createElement(
            'code',
            null,
            'msg.param2'
          ),
          ' and/or ',
          React.createElement(
            'code',
            null,
            'msg.param3'
          ),
          ' and/or ',
          React.createElement(
            'code',
            null,
            'msg.func'
          ),
          ' to override this node\'s configuration.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Performs Lodash string functions'
      );
    }
  });
};