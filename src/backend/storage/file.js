

module.exports = function(PN) {
  const _ = PN.util;
  class FileNode extends PN.Node {}
  PN.nodes.registerType("file",FileNode);

  PN.events.on('rpc_file_upload', function(data) {
    var node = PN.nodes.getNode(data.params[0]);
    if (node) {
      node.send(_.assign({topic: 'file', payload: data.params[1].name}, data.params[1]));
      data.reply('ok');
    } else {
      data.reply('not ok');
    }
  });
};
