"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var arrayFunctions = require('../../shared/nodes/arrays').arrayFunctions;
var util = require("util");

module.exports = function (PN) {

  var _ = require("lodash");
  var DEFAULT_RESULT = 'payload';
  var DEFAULT_INPUT = 'payload';
  var DEFAULT_INPUT_TYPE = 'msg';
  var DEFAULT_OUTPUT_TYPE = 'msg';

  function parametersExpected(inputMap, funct) {
    var number = inputMap[funct].params.length + 1;
    return number;
  }

  var ArraysNode = function (_PN$Node) {
    _inherits(ArraysNode, _PN$Node);

    function ArraysNode(n) {
      _classCallCheck(this, ArraysNode);

      var _this = _possibleConstructorReturn(this, (ArraysNode.__proto__ || Object.getPrototypeOf(ArraysNode)).call(this, n));

      var node = _this;
      node.func = n.func;
      node.param2 = n.param2;
      node.param3 = n.param3;
      node.param4 = n.param4;
      node.param2Type = n.param2Type;
      node.param3Type = n.param3Type;
      node.param4Type = n.param4Type;
      node.resultProp = n.resultProp || DEFAULT_RESULT;
      node.payloadProp = n.payloadProp || DEFAULT_INPUT;
      node.payloadPropType = n.payloadPropType || DEFAULT_INPUT_TYPE;
      node.resultPropType = n.resultPropType || 'msg';

      node.on("input", function (msg) {
        var func = node.func;
        var param2, param3, param4;
        var resultProp = node.resultProp;
        var payloadProp = node.payloadProp;
        var payloadPropType = node.payloadPropType;

        if (msg.hasOwnProperty('func')) {
          func = msg.func;
        }
        if (!arrayFunctions[func]) {
          return node.error("invalid function");
        }

        var lodashFunc = _[func];
        if (lodashFunc) {
          var msgInput = PN.util.evaluateNodeProperty(payloadProp, payloadPropType, node, msg);
          var numberOfParameters = parametersExpected(arrayFunctions, func);

          // Use any user set outside-of-node prefernces
          // Design Note: Properties attached to message should
          // take precedence over text field input
          if (msg.hasOwnProperty('param2')) {
            param2 = msg.param2;
          } else {
            param2 = PN.util.evaluateNodeProperty(node.param2, node.param2Type, node, msg);
          }

          if (msg.hasOwnProperty('param3')) {
            param3 = msg.param3;
          } else {
            param3 = PN.util.evaluateNodeProperty(node.param3, node.param3Type, node, msg);
          }

          if (msg.hasOwnProperty('param4')) {
            param4 = msg.param4;
          } else {
            param4 = PN.util.evaluateNodeProperty(node.param4, node.param4Type, node, msg);
          }

          console.log('msgInput', msgInput, 'param2', param2, 'param3', param3);
          if (numberOfParameters === 1) {
            node.setResult(msg, lodashFunc(msgInput));
          } else if (numberOfParameters === 2) {
            node.setResult(msg, lodashFunc(msgInput, param2));
          } else if (numberOfParameters === 3) {
            node.setResult(msg, lodashFunc(msgInput, param2, param3));
          } else {
            node.setResult(msg, lodashFunc(msgInput, param2, param3, param4));
          }
          node.send(msg);
        }
      });
      return _this;
    }

    return ArraysNode;
  }(PN.Node);

  PN.nodes.registerType("arrays", ArraysNode);
};