const isoNodes = require('./isoNodes');

const headlessNodes = [
  require("./io/nodebot"),
  require("./io/serialconnection"),
];

module.exports = isoNodes.concat(headlessNodes);
