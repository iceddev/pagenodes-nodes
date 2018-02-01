module.exports = function(PN) {
  class CommentNode extends PN.Node {}
  PN.nodes.registerType("comment",CommentNode);
}
