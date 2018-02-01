"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var RbeNode = function (_PN$Node) {
    _inherits(RbeNode, _PN$Node);

    function RbeNode(n) {
      _classCallCheck(this, RbeNode);

      var _this = _possibleConstructorReturn(this, (RbeNode.__proto__ || Object.getPrototypeOf(RbeNode)).call(this, n));

      _this.func = n.func || "rbe";
      _this.gap = n.gap || "0";
      _this.start = n.start || '';
      _this.inout = n.inout || "out";
      _this.pc = false;
      if (_this.gap.substr(-1) === "%") {
        _this.pc = true;
        _this.gap = parseFloat(_this.gap);
      }
      _this.g = _this.gap;
      var node = _this;

      node.previous = {};
      _this.on("input", function (msg) {
        if (msg.hasOwnProperty("payload")) {
          var t = msg.topic || "_no_topic";
          if (this.func === "rbe") {
            if (_typeof(msg.payload) === "object") {
              if (_typeof(node.previous[t]) !== "object") {
                node.previous[t] = {};
              }
              if (!PN.util.compareObjects(msg.payload, node.previous[t])) {
                node.previous[t] = msg.payload;
                node.send(msg);
              }
            } else {
              if (msg.payload !== node.previous[t]) {
                node.previous[t] = msg.payload;
                node.send(msg);
              }
            }
          } else {
            var n = parseFloat(msg.payload);
            if (!isNaN(n)) {
              if (typeof node.previous[t] === 'undefined' && this.func === "narrowband") {
                if (node.start === '') {
                  node.previous[t] = n;
                } else {
                  node.previous[t] = node.start;
                }
              }
              if (node.pc) {
                node.gap = node.previous[t] * node.g / 100 || 0;
              }
              if (!node.previous.hasOwnProperty(t)) {
                node.previous[t] = n - node.gap;
              }
              if (Math.abs(n - node.previous[t]) >= node.gap) {
                if (this.func === "deadband") {
                  if (node.inout === "out") {
                    node.previous[t] = n;
                  }
                  node.send(msg);
                }
              } else {
                if (this.func === "narrowband") {
                  if (node.inout === "out") {
                    node.previous[t] = n;
                  }
                  node.send(msg);
                }
              }
              if (node.inout === "in") {
                node.previous[t] = n;
              }
            } else {
              node.warn(PN._("rbe.warn.nonumber"));
            }
          }
        } // ignore msg with no payload property.
      });
      return _this;
    }

    return RbeNode;
  }(PN.Node);

  PN.nodes.registerType("rbe", RbeNode);
};