"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {

  var mustache = require("mustache");

  var TriggerNode = function (_PN$Node) {
    _inherits(TriggerNode, _PN$Node);

    function TriggerNode(n) {
      _classCallCheck(this, TriggerNode);

      var _this = _possibleConstructorReturn(this, (TriggerNode.__proto__ || Object.getPrototypeOf(TriggerNode)).call(this, n));

      _this.op1 = n.op1 || "1";
      _this.op2 = n.op2 || "0";
      _this.op1type = n.op1type || "val";
      _this.op2type = n.op2type || "val";
      _this.extend = n.extend || "false";
      _this.units = n.units || "ms";
      _this.duration = n.duration || 250;
      if (_this.duration <= 0) {
        _this.duration = 0;
      } else {
        if (_this.units == "s") {
          _this.duration = _this.duration * 1000;
        }
        if (_this.units == "min") {
          _this.duration = _this.duration * 1000 * 60;
        }
        if (_this.units == "hr") {
          _this.duration = _this.duration * 1000 * 60 * 60;
        }
      }
      _this.op1Templated = _this.op1.indexOf("{{") != -1;
      _this.op2Templated = _this.op2.indexOf("{{") != -1;
      if (!isNaN(_this.op1)) {
        _this.op1 = Number(_this.op1);
      }
      if (!isNaN(_this.op2)) {
        _this.op2 = Number(_this.op2);
      }
      if (_this.op1 == "true") {
        _this.op1 = true;
      }
      if (_this.op2 == "true") {
        _this.op2 = true;
      }
      if (_this.op1 == "false") {
        _this.op1 = false;
      }
      if (_this.op2 == "false") {
        _this.op2 = false;
      }
      if (_this.op1 == "null") {
        _this.op1 = null;
      }
      if (_this.op2 == "null") {
        _this.op2 = null;
      }
      try {
        _this.op1 = JSON.parse(_this.op1);
      } catch (e) {
        _this.op1 = _this.op1;
      }
      try {
        _this.op2 = JSON.parse(_this.op2);
      } catch (e) {
        _this.op2 = _this.op2;
      }

      var node = _this;
      var tout = null;
      var m2;
      _this.on("input", function (msg) {
        if (msg.hasOwnProperty("reset")) {
          clearTimeout(tout);
          tout = null;
          node.status({});
        } else {
          if (!tout) {
            if (node.op2type === "pay") {
              m2 = msg.payload;
            } else if (node.op2Templated) {
              m2 = mustache.render(node.op2, msg);
            } else {
              m2 = node.op2;
            }
            if (node.op1type === "pay") {} else if (node.op1Templated) {
              msg.payload = mustache.render(node.op1, msg);
            } else {
              msg.payload = node.op1;
            }
            if (node.op1type !== "nul") {
              node.send(msg);
            }
            if (node.duration === 0) {
              tout = 0;
            } else {
              tout = setTimeout(function () {
                msg.payload = m2;
                if (node.op2type !== "nul") {
                  node.send(msg);
                }
                tout = null;
                node.status({});
              }, node.duration);
            }
            node.status({ fill: "blue", shape: "dot", text: " " });
          } else if ((node.extend === "true" || node.extend === true) && node.duration > 0) {
            clearTimeout(tout);
            tout = setTimeout(function () {
              msg.payload = m2;
              if (node.op2type !== "nul") {
                node.send(msg);
              }
              tout = null;
              node.status({});
            }, node.duration);
          }
        }
      });
      _this.on("close", function () {
        if (tout) {
          clearTimeout(tout);
          node.status({});
        }
      });
      return _this;
    }

    return TriggerNode;
  }(PN.Node);

  PN.nodes.registerType("trigger", TriggerNode);
};