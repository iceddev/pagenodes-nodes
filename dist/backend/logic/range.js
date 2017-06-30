"use strict";

module.exports = function (PN) {
  "use strict";

  function RangeNode(n) {
    PN.nodes.createNode(this, n);
    this.action = n.action;
    this.round = n.round || false;
    this.minin = Number(n.minin);
    this.maxin = Number(n.maxin);
    this.minout = Number(n.minout);
    this.maxout = Number(n.maxout);
    var node = this;

    this.on('input', function (msg) {
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
  }
  PN.nodes.registerType("range", RangeNode);
};