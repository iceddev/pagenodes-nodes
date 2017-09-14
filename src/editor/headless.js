const isoNodes = require('./isoNodes');

const headlessNodes = [
  require("./io/nodebot"),
  require("./io/serialconnection"),
  require("./io/irc"),
];

module.exports = isoNodes.concat(headlessNodes);
