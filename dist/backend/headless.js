'use strict';

var isoNodes = require('./isoNodes');

var headlessNodes = [require('./io/lib/nodebot'), require('./core/function')];

module.exports = isoNodes.concat(headlessNodes);