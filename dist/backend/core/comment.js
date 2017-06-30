"use strict";

module.exports = function (PN) {
  "use strict";

  function CommentNode(n) {
    PN.nodes.createNode(this, n);
  }
  PN.nodes.registerType("comment", CommentNode);
};