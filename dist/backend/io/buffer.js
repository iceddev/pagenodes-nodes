"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var BufferNode = function (_PN$Node) {
    _inherits(BufferNode, _PN$Node);

    function BufferNode(n) {
      _classCallCheck(this, BufferNode);

      var _this = _possibleConstructorReturn(this, (BufferNode.__proto__ || Object.getPrototypeOf(BufferNode)).call(this, n));

      var node = _this;
      node.encoding = n.encoding;

      _this.on("input", function (msg) {
        var inputVal = node.getPayloadValue(msg);
        if (inputVal) {
          var encoder = node.encoding;
          // Use user set encoding property on message if available
          if (msg.hasOwnProperty("encoding")) {
            encoder = msg.encoding;
          }

          if (Buffer.isBuffer(inputVal)) {
            node.setResult(msg, new Buffer(inputVal).toString(encoder));
          } else if (Array.isArray(inputVal)) {
            node.setResult(msg, new Buffer(inputVal));
          } else {
            // The string must be turned into a Buffer
            // with default or specified encoding
            var data = String(inputVal);
            if (encoder === 'dataUrl') {
              try {
                data = data.split(';')[1].split(',')[1];
                encoder = 'base64';
              } catch (exp) {
                console.log('error parsing dataUrl', exp);
              }
            }
            node.setResult(msg, new Buffer(data, encoder));
          }
        }
        node.send(msg);
      });
      return _this;
    }

    return BufferNode;
  }(PN.Node);

  PN.nodes.registerType("buffer", BufferNode);
};