'use strict';

var collectionFunctions = require('../../shared/nodes/collections').collectionFunctions;
var _ = require('lodash');

module.exports = function (PN) {

  PN.nodes.registerType('collections', {
    category: 'function', // the palette category
    color: "#66d9ef", // yellow like other function nodes
    defaults: { // defines the editable properties of the node
      name: { value: "" }, //  along with default values.
      func: { value: "countBy", required: true },
      wantsPayloadParsed: { value: false, required: true },
      param2: { value: "", required: false },
      param3: { value: "", required: false },
      param4: { value: "", requried: false },
      param2Type: { value: "str", required: false },
      param3Type: { value: "str", required: false },
      param4Type: { value: "str", requried: false },
      payload: { value: "payload", required: false },
      result: { value: "payload", required: false },
      payloadType: { value: "msg", required: false },
      resultType: { value: "msg", required: false }
    },
    inputs: 1, // set the number of inputs - only 0 or 1
    outputs: 1, // set the number of outputs - 0 to n
    faChar: "&#xf0cb;", // 's' text icon
    label: function label() {
      return this.name || this.func || "collections";
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },

    oneditprepare: function oneditprepare() {
      var myFuncDef = collectionFunctions[this.func];

      PN.util.setupTypedPayload(this);
      PN.util.setupTypedResult(this);
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
        handleFunc(collectionFunctions[this.value]);
      });
    },

    // options needs replacement, but collections node code review touches up are here for the rows

    render: function render() {
      var _PN$components = PN.components,
          NameRow = _PN$components.NameRow,
          TypeTextRow = _PN$components.TypeTextRow,
          SelectRow = _PN$components.SelectRow,
          PayloadRow = _PN$components.PayloadRow,
          ResultRow = _PN$components.ResultRow;

      var funcNames = _.keys(collectionFunctions).sort();
      return React.createElement(
        'div',
        null,
        React.createElement(PayloadRow, null),
        React.createElement(SelectRow, { name: 'func', icon: 'gears', options: funcNames }),
        React.createElement(TypeTextRow, { name: 'param2', icon: 'crosshairs' }),
        React.createElement(TypeTextRow, { name: 'param3', icon: 'crosshairs' }),
        React.createElement(TypeTextRow, { name: 'param4', icon: 'crosshairs' }),
        React.createElement(ResultRow, null),
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
              { href: 'https://lodash.com/docs#countBy', target: '_new' },
              'Lodash'
            )
          ),
          ' collection functions that use ',
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
        'Performs Lodash collection functions'
      );
    }
  });
};