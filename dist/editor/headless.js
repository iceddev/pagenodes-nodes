"use strict";

var isoNodes = require('./isoNodes');

var headlessNodes = [require("./io/nodebot"), require("./io/serialconnection"), require("./io/irc")];

module.exports = isoNodes.concat(headlessNodes);