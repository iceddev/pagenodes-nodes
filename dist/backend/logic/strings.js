'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('../../shared/nodes/strings'),
    stringFunctions = _require.stringFunctions,
    addCustomFunctions = _require.addCustomFunctions;

var _ = require('lodash');
addCustomFunctions(_);

module.exports = function (PN) {

  var DEFAULT_RESULT = 'payload';
  var DEFAULT_INPUT = 'payload';
  var DEFAULT_INPUT_TYPE = 'msg';

  var StringsNode = function (_PN$Node) {
    _inherits(StringsNode, _PN$Node);

    function StringsNode(n) {
      _classCallCheck(this, StringsNode);

      var _this = _possibleConstructorReturn(this, (StringsNode.__proto__ || Object.getPrototypeOf(StringsNode)).call(this, n));

      var node = _this;
      node.func = n.func;
      node.param2 = n.param2;
      node.param3 = n.param3;
      node.param2Type = n.param2Type;
      node.param3Type = n.param3Type;
      node.resultProp = n.resultProp || DEFAULT_RESULT;
      node.resultPropType = n.resultPropType || DEFAULT_INPUT_TYPE;
      node.payloadProp = n.payloadProp || DEFAULT_INPUT;
      node.payloadPropType = n.payloadPropType || DEFAULT_INPUT_TYPE;

      _this.on("input", function (msg) {
        var func = node.func;
        var param2, param3;
        var resultProp = node.resultProp;

        var msgInput = PN.util.evaluateNodeProperty(node.payloadProp, node.payloadPropType, node, msg);

        // Use any user set outside-of-node prefernces
        // Design Note: Properties attached to message should
        // take precedence over text field input
        if (msg.hasOwnProperty('param2')) {
          param2 = msg.param2;
        } else if (node.param2) {
          param2 = PN.util.evaluateNodeProperty(node.param2, node.param2Type, node, msg);
        }

        if (msg.hasOwnProperty('param3')) {
          param3 = msg.param3;
        } else if (node.param3) {
          param3 = PN.util.evaluateNodeProperty(node.param3, node.param3Type, node, msg);
        }

        if (msg.hasOwnProperty('func')) {
          func = msg.func;
        }

        if (!stringFunctions[func]) {
          return node.error("invalid function");
        }
        var lodashFunc = _[func];
        if (lodashFunc) {
          console.log('msgInput', msgInput, 'param2', param2, 'param3', param3);
          node.setResult(msg, lodashFunc(msgInput, param2, param3));
          node.send(msg);
        }
      });
      return _this;
    }

    return StringsNode;
  }(PN.Node);

  PN.nodes.registerType("strings", StringsNode);
};