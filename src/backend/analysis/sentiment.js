module.exports = function(PN) {

  const sentiment = require('sentiment');

  class SentimentNode extends PN.Node {
    constructor(n) {
      super(n);

      this.on("input", (msg) => {
        if (msg.hasOwnProperty("payload")) {
          sentiment(msg.payload, msg.overrides || null, (err, result) => {
            msg.sentiment = result;
            this.send(msg);
          });
        }
        else { this.send(msg); } // If no payload - just pass it on.
      });
    }
  }

  PN.nodes.registerType("sentiment", SentimentNode);
}
