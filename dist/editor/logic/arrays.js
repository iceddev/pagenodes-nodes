'use strict';

var arrayFunctions = require('../../shared/nodes/arrays').arrayFunctions;
var _ = require('lodash');

module.exports = function (PN) {

  PN.nodes.registerType('arrays', {
    category: 'function', // the palette category
    color: "#66d9ef", // yellow like other function nodes
    defaults: { // defines the editable properties of the node
      name: { value: "" }, //  along with default values.
      func: { value: "chunk", required: true },
      wantsPayloadParsed: { value: false, required: true },
      param2: { value: "", required: false },
      param3: { value: "", required: false },
      param4: { value: "", requried: false },
      param2Type: { value: "str", required: false },
      param3Type: { value: "str", required: false },
      param4Type: { value: "str", requried: false },
      payloadProp: { value: "payload", required: false },
      resultProp: { value: "payload", required: false },
      payloadPropType: { value: "msg", required: false },
      resultPropType: { value: "msg", required: false }
    },
    inputs: 1, // set the number of inputs - only 0 or 1
    outputs: 1, // set the number of outputs - 0 to n
    faChar: "&#xf0cb;", // 's' text icon
    label: function label() {
      return this.name || this.func || "arrays";
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },

    oneditprepare: function oneditprepare() {
      var myFuncDef = arrayFunctions[this.func];

      PN.util.setupTypedText({ name: 'payloadProp', node: this, types: ['msg', 'flow', 'str', 'num', 'bool', 'json'] });
      PN.util.setupTypedText({ name: 'resultProp', node: this, types: ['msg', 'flow'] });
      PN.util.setupTypedText({ name: 'param2', node: this, types: ['str', 'num', 'bool', 'json', 'msg', 'flow'] });
      PN.util.setupTypedText({ name: 'param3', node: this, types: ['str', 'num', 'bool', 'json', 'msg', 'flow'] });
      PN.util.setupTypedText({ name: 'param4', node: this, types: ['str', 'num', 'bool', 'json', 'msg', 'flow'] });

      function handleFunc(functionDef) {
        $("#node-div-param2Row").hide();
        $("#node-div-param3Row").hide();
        $("#node-div-param4Row").hide();
        $("#node-div-description").hide();
        if (functionDef.hasOwnProperty('params')) {
          if (functionDef.params.length === 0) {
            $("#node-div-description").html(functionDef.description);
            $("#node-div-description").show();
          } else if (functionDef.params.length === 1) {
            $("#node-label-param2").html(functionDef.params[0].name);
            $("#node-div-description").html(functionDef.description);
            $("#node-div-description").show();
            $("#node-div-param2Row").show();
          } else if (functionDef.params.length === 2) {
            $("#node-label-param2").html(functionDef.params[0].name);
            $("#node-label-param3").html(functionDef.params[1].name);
            $("#node-div-description").html(functionDef.description);
            $("#node-div-description").show();
            $("#node-div-param2Row").show();
            $("#node-div-param3Row").show();
          } else {
            $("#node-label-param2").html(functionDef.params[0].name);
            $("#node-label-param3").html(functionDef.params[1].name);
            $("#node-label-param4").html(functionDef.params[2].name);
            $("#node-div-description").html(functionDef.description);
            $("#node-div-description").show();
            $("#node-div-param2Row").show();
            $("#node-div-param3Row").show();
            $("#node-div-param4Row").show();
          }
        }
      }

      handleFunc(myFuncDef);

      var funcInput = $("#node-input-func");
      funcInput.change(function () {
        handleFunc(arrayFunctions[this.value]);
      });
    },

    render: function render() {
      var _PN$components = PN.components,
          NameRow = _PN$components.NameRow,
          TextRow = _PN$components.TextRow,
          TypeTextRow = _PN$components.TypeTextRow,
          SelectRow = _PN$components.SelectRow;

      var funcNames = _.keys(arrayFunctions).sort();
      return React.createElement(
        'div',
        null,
        React.createElement(TypeTextRow, { name: 'payloadProp', label: 'input', icon: 'arrow-down' }),
        React.createElement(SelectRow, { name: 'func', icon: 'gears', options: funcNames }),
        React.createElement(TypeTextRow, { name: 'param2', icon: 'crosshairs' }),
        React.createElement(TypeTextRow, { name: 'param3', icon: 'crosshairs' }),
        React.createElement(TypeTextRow, { name: 'param4', icon: 'crosshairs' }),
        React.createElement(TypeTextRow, { name: 'resultProp', label: 'output', icon: 'arrow-up' }),
        React.createElement(NameRow, null),
        React.createElement('div', { className: 'form-tips', id: 'node-div-description' })
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
              { href: 'https://lodash.com/docs#chunk', target: '_new' },
              'Lodash'
            )
          ),
          ' array functions that use ',
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
          ', ',
          React.createElement(
            'code',
            null,
            'msg.param3'
          ),
          ', and/or ',
          React.createElement(
            'code',
            null,
            'msg.param4'
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
        'Performs Lodash array functions'
      );
    }
  });
};