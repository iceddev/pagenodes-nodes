"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var RangeNode = function (_PN$Node) {
    _inherits(RangeNode, _PN$Node);

    function RangeNode(n) {
      _classCallCheck(this, RangeNode);

      var _this = _possibleConstructorReturn(this, (RangeNode.__proto__ || Object.getPrototypeOf(RangeNode)).call(this, n));

      _this.action = n.action;
      _this.round = n.round || false;
      _this.minin = Number(n.minin);
      _this.maxin = Number(n.maxin);
      _this.minout = Number(n.minout);
      _this.maxout = Number(n.maxout);
      var node = _this;

      _this.on('input', function (msg) {
        if (msg.hasOwnProperty("payload")) {
          var n = Number(msg.payload);
          if (!isNaN(n)) {
            if (node.action == "clamp") {
              if (n < node.minin) {
                n = node.minin;
              }
              if (n > node.maxin) {
                n = node.maxin;
              }
            }
            if (node.action == "roll") {
              if (n >= node.maxin) {
                n = (n - node.minin) % (node.maxin - node.minin) + node.minin;
              }
              if (n < node.minin) {
                n = (n - node.minin) % (node.maxin - node.minin) + node.maxin;
              }
            }
            msg.payload = (n - node.minin) / (node.maxin - node.minin) * (node.maxout - node.minout) + node.minout;
            if (node.round) {
              msg.payload = Math.round(msg.payload);
            }
            node.send(msg);
          } else {
            node.log(PN._("range.errors.notnumber") + ": " + msg.payload);
          }
        } else {
          node.send(msg);
        } // If no payload - just pass it on.
      });
      return _this;
    }

    return RangeNode;
  }(PN.Node);

  PN.nodes.registerType("range", RangeNode);
};