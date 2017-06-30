"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (PN) {
  "use strict";

  function RbeNode(n) {
    PN.nodes.createNode(this, n);
    this.func = n.func || "rbe";
    this.gap = n.gap || "0";
    this.start = n.start || '';
    this.inout = n.inout || "out";
    this.pc = false;
    if (this.gap.substr(-1) === "%") {
      this.pc = true;
      this.gap = parseFloat(this.gap);
    }
    this.g = this.gap;
    var node = this;

    node.previous = {};
    this.on("input", function (msg) {
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
  }
  PN.nodes.registerType("rbe", RbeNode);
};