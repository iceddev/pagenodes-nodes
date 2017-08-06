'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ = require('lodash');

var WW_SCRIPT = '/shape-worker.bundle.js';

var worker = void 0;

function getImageData(imgUrl, callback) {
  var img = new Image();
  img.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.height = img.naturalHeight;
    canvas.width = img.naturalWidth;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    callback(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };
  img.src = imgUrl;
}

module.exports = function (PN) {

  function ShapeDetectorNode(n) {

    if (!worker) {
      worker = new Worker(WW_SCRIPT);
      worker.onmessage = function (evt) {
        var data = evt.data;
        PN.events.emit('shape_' + data.nodeId, data);
      };
    }

    PN.nodes.createNode(this, n);
    var node = this;
    node.name = n.name;
    node.shapeType = n.shapeType;
    node.msgs = {};

    function handleResults(data) {
      try {
        if (data.error) {
          node.error(data.error);
        } else {
          node.msgs[data._msgid].results = data.results;
          node.send(node.msgs[data._msgid]);
        }
        delete node.msgs[data._msgid];
      } catch (exp) {
        node.error(exp);
      }
    }

    PN.events.on('shape_' + node.id, handleResults);

    node.on('close', function () {
      PN.events.removeListener('shape_' + node.id, handleResults);
    });

    try {
      node.on("input", function (msg) {
        try {
          if (!msg.image) {
            return node.send(msg);
          }
          var _msgid = msg._msgid = msg._msgid || PN.util.generateId();
          node.msgs[msg._msgid] = msg;
          var nodeId = node.id;
          if (typeof msg.image === 'string') {
            getImageData(msg.image, function (imageData) {
              worker.postMessage({ nodeId: nodeId, _msgid: _msgid, imageData: imageData, shapeType: msg.shapeType || node.shapeType });
            });
          } else if (_typeof(msg.image) === 'object') {
            worker.postMessage({ nodeId: nodeId, _msgid: _msgid, imageData: msg.image, shapeType: msg.shapeType || node.shapeType });
          }
        } catch (err) {
          node.error(err);
        }
      });
    } catch (err) {
      node.error(err);
    }
  }
  PN.nodes.registerType("shape", ShapeDetectorNode);
};