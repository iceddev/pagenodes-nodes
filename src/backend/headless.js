const isoNodes = require('./isoNodes');

const headlessNodes = [
  // require('./io/lib/nodebot'),
  // require('./core/function'),
  // require('./io/serialconnection'),
  require('./io/irc'),
];

module.exports = isoNodes.concat(headlessNodes);
