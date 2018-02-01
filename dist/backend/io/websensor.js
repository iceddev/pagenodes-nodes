'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sensorTypes = require('../../shared/nodes/websensors');

module.exports = function (PN) {
  var WebSensorNode = function (_PN$Node) {
    _inherits(WebSensorNode, _PN$Node);

    function WebSensorNode(config) {
      _classCallCheck(this, WebSensorNode);

      var _this = _possibleConstructorReturn(this, (WebSensorNode.__proto__ || Object.getPrototypeOf(WebSensorNode)).call(this, config));

      var node = _this;
      node.sensorType = config.sensorType;

      if (!sensorTypes[node.sensorType] || !window[node.sensorType]) {
        var _ret;

        return _ret = node.error(new Error('Sensor ' + node.sensorType + ' not supported in this browser')), _possibleConstructorReturn(_this, _ret);
      }

      var sensor = new window[node.sensorType]();
      sensor.start();

      sensor.onchange = function (event) {
        // console.log(event.reading);

        node.send({
          topic: 'web sensor',
          sensorType: node.sensorType,
          payload: event.target.reading
        });
      };

      sensor.onerror = function (event) {
        node.error(event.error);
        // console.log(event.error.name, event.error.message);
      };

      node.on('close', function () {
        sensor.stop();
      });
      return _this;
    }

    return WebSensorNode;
  }(PN.Node);

  PN.nodes.registerType("web sensor", WebSensorNode);
};