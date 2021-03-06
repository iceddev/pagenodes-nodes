'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');

var WW_SCRIPT = './shape-worker.bundle.js';

var worker = void 0;

function getImageData(img) {
  var canvas = document.createElement('canvas');
  canvas.height = img.naturalHeight;
  canvas.width = img.naturalWidth;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function imageToUrl(img) {
  var canvas = document.createElement('canvas');
  canvas.height = img.naturalHeight;
  canvas.width = img.naturalWidth;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL();
}

function resize(img, width, height) {
  var canvas = document.createElement('canvas');
  canvas.height = height;
  canvas.width = width;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL();
}

function getImage(imgUrl, callback) {
  var img = new Image();
  img.onload = function () {
    callback(img);
  };
  img.src = imgUrl;
}

function dataToImageUrl(data) {
  var canvas = document.createElement('canvas');
  canvas.height = data.height;
  canvas.width = data.width;
  var ctx = canvas.getContext('2d');
  ctx.putImageData(data, 0, 0);
  return canvas.toDataURL();
}

function dataToImage(data, callback) {
  var canvas = document.createElement('canvas');
  canvas.height = data.height;
  canvas.width = data.width;
  var ctx = canvas.getContext('2d');
  ctx.putImageData(data, 0, 0);
  var img = new Image();
  img.onload = function () {
    callback(img);
  };
  img.src = imgUrl;
}

function crop(img, left, top, width, height) {
  console.log('crop', left, top, width, height);
  var canvas = document.createElement('canvas');
  canvas.height = height;
  canvas.width = width;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, left, top, width, height, 0, 0, width, height);
  return canvas.toDataURL();
}

module.exports = function (PN) {
  var ImageNode = function (_PN$Node) {
    _inherits(ImageNode, _PN$Node);

    function ImageNode(n) {
      _classCallCheck(this, ImageNode);

      var _this = _possibleConstructorReturn(this, (ImageNode.__proto__ || Object.getPrototypeOf(ImageNode)).call(this, n));

      var node = _this;
      node.operation = n.operation;

      function handleOperation(msg, img) {
        var op = msg.operation || node.operation;
        console.log('handleOperation', op, msg);
        if (op === 'getImageData') {
          return getImageData(img);
        }
        if (op === 'dataToUrl') {
          return imageToUrl(img);
        } else if (op === 'resize') {
          var width = parseInt(msg.width, 10) || 100;
          var height = parseInt(msg.height, 10) || 100;
          return resize(img, width, height);
        } else if (op === 'crop') {
          var width = parseInt(msg.width, 10) || 100;
          var height = parseInt(msg.height, 10) || 100;
          var top = parseInt(msg.top, 10) || 0;
          var left = parseInt(msg.left, 10) || 0;
          return crop(img, left, top, width, height);
        } else {
          return msg.image;
        }
      }

      try {
        node.on("input", function (msg) {
          try {
            if (!msg.image) {
              return node.send(msg);
            }
            if (typeof msg.image === 'string') {
              getImage(msg.image, function (img) {
                msg.image = handleOperation(msg, img);
                node.send(msg);
              });
            } else if (_typeof(msg.image) === 'object') {
              dataToImage(msg.image, function (img) {
                msg.image = handleOperation(msg, img);
              });
            }
          } catch (err) {
            node.error(err);
          }
        });
      } catch (err) {
        node.error(err);
      }
      return _this;
    }

    return ImageNode;
  }(PN.Node);

  PN.nodes.registerType("image", ImageNode);
};