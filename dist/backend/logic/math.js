'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');

module.exports = function (PN) {

  function getNumber(input, radix) {
    input = '' + input;
    if (input.indexOf('.') > -1) {
      return parseFloat(input, radix);
    } else if (input.toLowerCase() === "pi") {
      return Math.PI;
    } else if (input.toLowerCase() === "e") {
      return Math.E;
    }
    return parseInt(input, radix);
  }

  function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }

  var MathNode = function (_PN$Node) {
    _inherits(MathNode, _PN$Node);

    function MathNode(n) {
      _classCallCheck(this, MathNode);

      var _this = _possibleConstructorReturn(this, (MathNode.__proto__ || Object.getPrototypeOf(MathNode)).call(this, n));

      var node = _this;
      node.operand = n.operand;
      node.operandType = n.operandType || 'num';
      node.operator = n.operator;

      _this.on("input", function (msg) {

        // Use any user set outside-of-node prefernces
        var radix = 10;
        var operand = node.getInputValue('operand', msg);

        if (msg.hasOwnProperty('operand')) {
          operand = msg.operand;
        }
        if (msg.hasOwnProperty('radix')) {
          radix = msg.radix;
        }

        var rawInput = node.getPayloadValue(msg);
        var inputVal = getNumber(rawInput, radix);
        var operandVal = getNumber(operand, radix);

        // Preform selected operation:
        if (node.operator === "+") {
          node.setResult(msg, inputVal + operandVal);
        } else if (node.operator === "-") {
          node.setResult(msg, inputVal - operandVal);
        } else if (node.operator === "*") {
          node.setResult(msg, inputVal * operandVal);
        } else if (node.operator === "/") {
          node.setResult(msg, inputVal / operandVal);
        } else if (node.operator === "%") {
          node.setResult(msg, inputVal % operandVal);
        } else if (node.operator === "^") {
          node.setResult(msg, Math.pow(inputVal, operandVal));
        } else if (node.operator === "log") {
          node.setResult(msg, getBaseLog(inputVal, operandVal));
        } else if (node.operator === "round") {
          node.setResult(msg, Math.round(inputVal));
        } else if (node.operator === "floor") {
          node.setResult(msg, Math.floor(inputVal));
        } else if (node.operator === "ceil") {
          node.setResult(msg, Math.ceil(inputVal));
        } else if (node.operator === "sin") {
          if (inputVal === Math.PI) {
            node.setResult(msg, 0);
          } else {
            node.setResult(msg, Math.sin(inputVal));
          }
        } else if (node.operator === "cos") {
          if (inputVal === Math.PI) {
            node.setResult(msg, -1);
          } else {
            node.setResult(msg, Math.cos(inputVal));
          }
        } else if (node.operator === "tan") {
          if (inputVal === Math.PI) {
            node.setResult(msg, 0);
          } else {
            node.setResult(msg, Math.tan(inputVal));
          }
        } else if (node.operator === "csc") {
          if (inputVal === Math.PI) {
            node.setResult(msg, null);
          } else {
            node.setResult(msg, 1 / Math.sin(inputVal));
          }
        } else if (node.operator === "sec") {
          if (inputVal === Math.PI) {
            node.setResult(msg, -1);
          } else {
            node.setResult(msg, 1 / Math.cos(inputVal));
          }
        } else if (node.operator === "cot") {
          if (inputVal === Math.PI) {
            node.setResult(msg, null);
          } else {
            node.setResult(msg, 1 / Math.tan(inputVal));
          }
        } else if (node.operator === "-r") {
          node.setResult(msg, operandVal - inputVal);
        } else if (node.operator === "/r") {
          node.setResult(msg, operandVal / inputVal);
        } else if (node.operator === "%r") {
          node.setResult(msg, operandVal % inputVal);
        } else if (node.operator === "^r") {
          node.setResult(msg, Math.pow(operandVal, inputVal));
        } else if (node.operator === "logr") {
          node.setResult(msg, getBaseLog(operandVal, inputVal));
        } else if (node.operator === "roundr") {
          node.setResult(msg, Math.round(operandVal));
        } else if (node.operator === "floorr") {
          node.setResult(msg, Math.floor(operandVal));
        } else if (node.operator === "ceilr") {
          node.setResult(msg, Math.ceil(operandVal));
        } else if (node.operator === "sinr") {
          if (inputVal === Math.PI) {
            node.setResult(msg, 0);
          } else {
            node.setResult(msg, Math.sin(operandVal));
          }
        } else if (node.operator === "cosr") {
          if (inputVal === Math.PI) {
            node.setResult(msg, -1);
          } else {
            node.setResult(msg, Math.cos(operandVal));
          }
        } else if (node.operator === "tanr") {
          if (inputVal === Math.PI) {
            node.setResult(msg, 0);
          } else {
            node.setResult(msg, Math.tan(operandVal));
          }
        } else if (node.operator === "cscr") {
          if (inputVal === Math.PI) {
            node.setResult(msg, null);
          } else {
            node.setResult(msg, 1 / Math.sin(operandVal));
          }
        } else if (node.operator === "secr") {
          if (inputVal === Math.PI) {
            node.setResult(msg, -1);
          } else {
            node.setResult(msg, 1 / Math.cos(operandVal));
          }
        } else if (node.operator === "cotr") {
          if (inputVal === Math.PI) {
            node.setResult(msg, null);
          } else {
            node.setResult(msg, 1 / Math.tan(operandVal));
          }
        } else if (node.operator === "NOT") {
          node.setResult(msg, ~inputVal);
        } else if (node.operator === "OR") {
          node.setResult(msg, inputVal | operandVal);
        } else if (node.operator === "AND") {
          node.setResult(msg, inputVal & operandVal);
        } else if (node.operator === "XOR") {
          node.setResult(msg, inputVal ^ operandVal);
        } else if (node.operator === "<<") {
          node.setResult(msg, inputVal << operandVal);
        } else if (node.operator === ">>") {
          node.setResult(msg, inputVal >> operandVal);
        } else if (node.operator === 'concat') {
          //we don't otherwise have a simple concat node  ¯\_(ツ)_/¯

          if (Array.isArray(rawInput)) {
            node.setResult(msg, _.concat(rawInput, operand));
          } else {
            node.setResult(msg, rawInput + operand);
          }
        }

        node.send(msg);
      });
      return _this;
    }

    return MathNode;
  }(PN.Node);

  PN.nodes.registerType("math", MathNode);
};