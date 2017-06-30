"use strict";

var isoNodes = require('./isoNodes');

var headlessNodes = [require("./io/nodebot")];

module.exports = isoNodes.concat(headlessNodes);