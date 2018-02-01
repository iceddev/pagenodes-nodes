'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var AccelerometerNode = function (_PN$Node) {
    _inherits(AccelerometerNode, _PN$Node);

    function AccelerometerNode(config) {
      _classCallCheck(this, AccelerometerNode);

      var _this = _possibleConstructorReturn(this, (AccelerometerNode.__proto__ || Object.getPrototypeOf(AccelerometerNode)).call(this, config));

      var node = _this;
      var refreshInterval = parseInt(config.refreshInterval);
      var orientation = {};

      window.addEventListener("deviceorientation", function (event) {
        orientation.alpha = event.alpha;
        orientation.beta = event.beta;
        orientation.gamma = event.gamma;
      }, true);

      if (window.DeviceMotionEvent) {
        node.interval = setInterval(function () {
          var msg = { topic: 'orientation' };
          msg.payload = orientation;
          node.send(msg);
        }, refreshInterval);
      } else {
        node.error('Accelerometer not available.');
      }

      node.on('close', function () {
        console.log('I was closed');
        clearInterval(node.interval);
      });
      return _this;
    }

    return AccelerometerNode;
  }(PN.Node);

  PN.nodes.registerType("orientation", AccelerometerNode);
};