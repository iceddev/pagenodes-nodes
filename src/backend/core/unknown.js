module.exports = function(PN) {
  class UnknownNode extends PN.Node {}

  PN.nodes.registerType("unknown",UnknownNode);
}
