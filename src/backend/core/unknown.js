module.exports = function(PN) {
  "use strict";
  function UnknownNode(n) {
    PN.nodes.createNode(this,n);
  }
  PN.nodes.registerType("unknown",UnknownNode);
}

