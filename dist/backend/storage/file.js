'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');

module.exports = function (PN) {
  var FileNode = function (_PN$Node) {
    _inherits(FileNode, _PN$Node);

    function FileNode() {
      _classCallCheck(this, FileNode);

      return _possibleConstructorReturn(this, (FileNode.__proto__ || Object.getPrototypeOf(FileNode)).apply(this, arguments));
    }

    return FileNode;
  }(PN.Node);

  PN.nodes.registerType("file", FileNode);

  PN.events.on('rpc_file_upload', function (data) {
    var node = PN.nodes.getNode(data.params[0]);
    if (node) {
      node.send(_.assign({ topic: 'file', payload: data.params[1].name }, data.params[1]));
      data.reply('ok');
    } else {
      data.reply('not ok');
    }
  });
};