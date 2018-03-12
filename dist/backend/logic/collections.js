"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var collectionFunctions = require('../../shared/nodes/collections').collectionFunctions;

module.exports = function (PN) {
  var _ = require("lodash");

  function parametersExpected(inputMap, funct) {
    var number = inputMap[funct].params.length + 1;
    return number;
  }

  var CollectionsNode = function (_PN$Node) {
    _inherits(CollectionsNode, _PN$Node);

    function CollectionsNode(n) {
      _classCallCheck(this, CollectionsNode);

      var _this = _possibleConstructorReturn(this, (CollectionsNode.__proto__ || Object.getPrototypeOf(CollectionsNode)).call(this, n));

      var node = _this;
      node.func = n.func;
      node.param2 = n.param2;
      node.param3 = n.param3;
      node.param4 = n.param4;
      node.param2Type = n.param2Type;
      node.param3Type = n.param3Type;
      node.param4Type = n.param4Type;

      node.on("input", function (msg) {
        var func = node.func;
        var param2, param3, param4;
        var resultProp = node.resultProp;
        var payloadProp = node.payloadProp;
        var payloadPropType = node.payloadPropType;

        if (msg.hasOwnProperty('func')) {
          func = msg.func;
        }
        if (!collectionFunctions[func]) {
          return node.error("invalid function");
        }

        var lodashFunc = _[func];
        if (lodashFunc) {
          var msgInput = node.getPayloadValue(msg);
          var numberOfParameters = parametersExpected(collectionFunctions, func);

          // Use any user set outside-of-node prefernces
          // Design Note: Properties attached to message should
          // take precedence over text field input
          if (msg.hasOwnProperty('param2')) {
            param2 = msg.param2;
          } else {
            param2 = node.getInputValue('param2', msg);
          }

          if (msg.hasOwnProperty('param3')) {
            param3 = msg.param3;
          } else {
            param3 = node.getInputValue('param3', msg);
          }

          if (msg.hasOwnProperty('param4')) {
            param4 = msg.param4;
          } else {
            param4 = node.getInputValue('param4', msg);
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

    return CollectionsNode;
  }(PN.Node);

  PN.nodes.registerType("collections", CollectionsNode);
};