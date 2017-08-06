"use strict";

var isoNodes = require('./isoNodes');

var headlessNodes = [require("./io/nodebot"), require("./io/serialconnection")];

module.exports = isoNodes.concat(headlessNodes);