"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (PN) {
  "use strict";

  function SplitNode(n) {
    PN.nodes.createNode(this, n);
    this.splt = (n.splt || "\\n").replace(/\\n/, "\n").replace(/\\r/, "\r").replace(/\\t/, "\t").replace(/\\e/, "\e").replace(/\\f/, "\f").replace(/\\0/, "\0");
    var node = this;
    this.on("input", function (msg) {
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
  }
  PN.nodes.registerType("split", SplitNode);
};