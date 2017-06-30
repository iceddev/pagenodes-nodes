const isoNodes = require('./isoNodes');

const headlessNodes = [
  require("./io/nodebot"),
];

module.exports = isoNodes.concat(headlessNodes);
