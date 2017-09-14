'use strict';

var isoNodes = require('./isoNodes');

var headlessNodes = [require('./io/lib/nodebot'), require('./core/function'), require('./io/serialconnection'), require('./io/irc')];

module.exports = isoNodes.concat(headlessNodes);