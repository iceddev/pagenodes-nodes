"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var JSONNode = function (_PN$Node) {
    _inherits(JSONNode, _PN$Node);

    function JSONNode(n) {
      _classCallCheck(this, JSONNode);

      var _this = _possibleConstructorReturn(this, (JSONNode.__proto__ || Object.getPrototypeOf(JSONNode)).call(this, n));

      var node = _this;
      _this.on("input", function (msg) {
        var value = node.getPayloadValue(msg);
        if (value) {
          if (typeof value === "string") {
            try {
              node.setResult(msg, JSON.parse(msg[node.propName]));
              node.send(msg);
            } catch (e) {
              node.error(e.message, msg);
            }
          } else if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" || Array.isArray(value)) {
            if (!Buffer.isBuffer(value)) {
              try {
                node.setResult(msg, JSON.stringify(msg[node.propName]));
                return node.send(msg);
              } catch (e) {
                node.error(e);
              }
            }

            node.send(msg);
          } else {
            node.send(msg);
          }
        } else {
          node.send(msg); // If no payload - just pass it on.
        }
      });
      return _this;
    }

    return JSONNode;
  }(PN.Node);

  JSONNode.groupName = 'JSON'; //hack!!!
  PN.nodes.registerType("json", JSONNode);
};