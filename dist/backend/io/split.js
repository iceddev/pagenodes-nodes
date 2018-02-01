"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var SplitNode = function (_PN$Node) {
    _inherits(SplitNode, _PN$Node);

    function SplitNode(n) {
      _classCallCheck(this, SplitNode);

      var _this = _possibleConstructorReturn(this, (SplitNode.__proto__ || Object.getPrototypeOf(SplitNode)).call(this, n));

      _this.splt = (n.splt || "\\n").replace(/\\n/, "\n").replace(/\\r/, "\r").replace(/\\t/, "\t").replace(/\\e/, "\e").replace(/\\f/, "\f").replace(/\\0/, "\0");
      var node = _this;
      _this.on("input", function (msg) {
        if (msg.hasOwnProperty("payload")) {
          var a = msg.payload;
          if (msg.hasOwnProperty("parts")) {
            msg.parts = { parts: msg.parts };
          } // push existing parts to a stack
          else {
              msg.parts = {};
            }
          msg.parts.id = msg._msgid; // use the existing _msgid by default.
          if (typeof msg.payload === "string") {
            // Split String into array
            a = msg.payload.split(node.splt);
            msg.parts.ch = node.splt; // pass the split char to other end for rejoin
            msg.parts.type = "string";
          }
          if (Array.isArray(a)) {
            // then split array into messages
            msg.parts.type = msg.parts.type || "array"; // if it wasn't a string in the first place
            for (var i = 0; i < a.length; i++) {
              msg.payload = a[i];
              msg.parts.index = i;
              msg.parts.count = a.length;
              node.send(PN.util.cloneMessage(msg));
            }
          } else if (_typeof(msg.payload) === "object" && !Buffer.isBuffer(msg.payload)) {
            var j = 0;
            var l = Object.keys(msg.payload).length;
            var pay = msg.payload;
            msg.parts.type = "object";
            for (var p in pay) {
              if (pay.hasOwnProperty(p)) {
                msg.payload = pay[p];
                msg.parts.key = p;
                msg.parts.index = j;
                msg.parts.count = l;
                node.send(PN.util.cloneMessage(msg));
                j += 1;
              }
            }
          }
          // TODO not handling Buffers at present...
          //else {  }   // otherwise drop the message.
        }
      });
      return _this;
    }

    return SplitNode;
  }(PN.Node);

  PN.nodes.registerType("split", SplitNode);
};