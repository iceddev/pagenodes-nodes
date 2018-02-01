'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var gifshot = require('gifshot');

// The width and height of the captured photo. We will set the
// width to the value defined here, but the height will be
// calculated based on the aspect ratio of the input stream.

var width = 640; // We will scale the photo width to this
var height = 0; // This will be computed based on the input stream

// |streaming| indicates whether or not we're currently streaming
// video from the camera. Obviously, we start at false.

var streaming = false;

// The various HTML elements we need to configure or control. These
// will be set by the startup() function.


var startbutton = null;

//var initialized = false;
var mediaStream;

function takepicture(cb) {

  var container = document.createElement('div');
  var video = document.createElement('video');
  var canvas = document.createElement('canvas');

  navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  navigator.getMedia({
    video: true,
    audio: false
  }, function (stream) {
    mediaStream = stream;
    if (navigator.mozGetUserMedia) {
      video.mozSrcObject = stream;
    } else {
      var vendorURL = window.URL || window.webkitURL;
      video.src = vendorURL.createObjectURL(stream);
    }
    video.play();
  }, function (err) {
    console.log("An error occured! " + err);
  });

  video.addEventListener('canplay', function (ev) {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);

      // Firefox currently has a bug where the height can't be read from
      // the video, so we will make assumptions if this happens.

      if (isNaN(height)) {
        height = width / (4 / 3);
      }

      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      var context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;

        setTimeout(function () {
          context.drawImage(video, 0, 0, width, height);
          var data = canvas.toDataURL('image/png');
          mediaStream.getTracks().forEach(function (track) {
            track.stop();
          });
          cb(data);
        }, 700);
      }
    }
  }, false);
}

function takeGif(msg, cb) {
  var options = {};
  if (msg.gifWidth > 0) {
    options.gifWidth = msg.gifWidth;
  }
  if (msg.gifHeight > 0) {
    options.gifHeight = msg.gifHeight;
  }
  if (msg.sampleInterval > 0) {
    options.sampleInterval = msg.sampleInterval;
  }
  if (msg.gifHeight > 0) {
    options.gifWidth = msg.gifHeight;
  }
  gifshot.createGIF(options, function (obj) {
    // callback object properties
    // --------------------------
    // image - Base 64 image
    // cameraStream - The webRTC MediaStream object
    // error - Boolean that determines if an error occurred
    // errorCode - Helpful error label
    // errorMsg - Helpful error message
    // savedRenderingContexts - An array of canvas image data (will only be set if the saveRenderingContexts option was used)
    cb(obj.image);
    obj.cameraStream.getTracks().forEach(function (track) {
      track.stop();
    });
  });
}

module.exports = function (PN) {
  var CameraNode = function (_PN$Node) {
    _inherits(CameraNode, _PN$Node);

    function CameraNode(n) {
      _classCallCheck(this, CameraNode);

      var _this = _possibleConstructorReturn(this, (CameraNode.__proto__ || Object.getPrototypeOf(CameraNode)).call(this, n));

      var node = _this;
      node.animated = n.animated;

      _this.on("input", function (msg) {
        console.log('adding image', msg);
        if (node.animated) {
          takeGif(msg, function (image) {
            msg.image = image;
            node.send(msg);
          });
        } else {
          takepicture(function (image) {
            msg.image = image;
            node.send(msg);
          });
        }
      });
      return _this;
    }

    return CameraNode;
  }(PN.Node);

  PN.nodes.registerType("camera", CameraNode);
};