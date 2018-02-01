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
      node.propName = n.propName || "payload";
      _this.on("input", function (msg) {
        if (msg.hasOwnProperty(node.propName)) {
          var encoder = node.encoding;
          // Use user set encoding property on message if available
          if (msg.hasOwnProperty("encoding")) {
            encoder = msg.encoding;
          }

          if (Buffer.isBuffer(msg[node.propName])) {
            msg[node.propName] = new Buffer(msg[node.propName]).toString(encoder);
            // console.log('is buffer', msg[node.propName], encoder);
          } else if (Array.isArray(msg[node.propName])) {
            msg[node.propName] = new Buffer(msg[node.propName]);
          } else {
            // The string must be turned into a Buffer
            // with default or specified encoding
            // Preform selected operation:
            msg[node.propName] = new Buffer(String(msg[node.propName]), encoder);
            // console.log('bufferResult', bufferResult);
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