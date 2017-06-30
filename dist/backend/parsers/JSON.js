"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (PN) {

  function JSONNode(n) {
    PN.nodes.createNode(this, n);
    var node = this;
    node.propName = n.propName || 'payload';
    this.on("input", function (msg) {
      if (msg.hasOwnProperty(node.propName)) {
        if (typeof msg[node.propName] === "string") {
          try {
            msg[node.propName] = JSON.parse(msg[node.propName]);
            node.send(msg);
          } catch (e) {
            node.error(e.message, msg);
          }
        } else if (_typeof(msg[node.propName]) === "object" || Array.isArray(msg[node.propName])) {
          if (!Buffer.isBuffer(msg[node.propName])) {
            try {
              msg[node.propName] = JSON.stringify(msg[node.propName]);
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
  }
  JSONNode.groupName = 'JSON'; //hack!!!
  PN.nodes.registerType("json", JSONNode);
};