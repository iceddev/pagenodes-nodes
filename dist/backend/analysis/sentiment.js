"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {

  var sentiment = require('sentiment');

  var SentimentNode = function (_PN$Node) {
    _inherits(SentimentNode, _PN$Node);

    function SentimentNode(n) {
      _classCallCheck(this, SentimentNode);

      var _this = _possibleConstructorReturn(this, (SentimentNode.__proto__ || Object.getPrototypeOf(SentimentNode)).call(this, n));

      _this.on("input", function (msg) {
        if (msg.hasOwnProperty("payload")) {
          sentiment(msg.payload, msg.overrides || null, function (err, result) {
            msg.sentiment = result;
            _this.send(msg);
          });
        } else {
          _this.send(msg);
        } // If no payload - just pass it on.
      });
      return _this;
    }

    return SentimentNode;
  }(PN.Node);

  PN.nodes.registerType("sentiment", SentimentNode);
};