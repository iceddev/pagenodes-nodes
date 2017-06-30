const isoNodes = require('./isoNodes');

const headlessNodes = [
  require('./io/lib/nodebot'),
  require('./core/function'),
];

module.exports = isoNodes.concat(headlessNodes);
