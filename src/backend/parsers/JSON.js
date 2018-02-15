module.exports = function(PN) {
  class JSONNode extends PN.Node {
    constructor(n) {
      super(n);
      var node = this;
      this.on("input", function(msg) {
        const value = node.getPayloadValue(msg);
        if (value) {
          if (typeof value === "string") {
            try {
              node.setResult(msg, JSON.parse(msg[node.propName]))
              node.send(msg);
            }
            catch(e) { node.error(e.message,msg); }
          }
          else if (typeof value === "object" || Array.isArray(value)) {
            if (!Buffer.isBuffer(value)) {
              try {
                node.setResult(msg, JSON.stringify(msg[node.propName]));
                return node.send(msg);
              }
              catch(e) {
                node.error(e);
              }
            }

            node.send(msg);
          }
          else {
            node.send(msg);
          }
        }
        else {
          node.send(msg); // If no payload - just pass it on.
        }
      });
    }
  }
  JSONNode.groupName = 'JSON'; //hack!!!
  PN.nodes.registerType("json",JSONNode);
};
