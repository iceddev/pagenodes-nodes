module.exports = function(PN) {
  "use strict";
  var sentiment = require('sentiment');

  function SentimentNode(n) {
    PN.nodes.createNode(this,n);
    var node = this;

    this.on("input", function(msg) {
      if (msg.hasOwnProperty("payload")) {
        sentiment(msg.payload, msg.overrides || null, function (err, result) {
          msg.sentiment = result;
          node.send(msg);
        });
      }
      else { node.send(msg); } // If no payload - just pass it on.
    });
  }
  PN.nodes.registerType("sentiment",SentimentNode);
}

