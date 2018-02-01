"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var RemoteNode = function (_PN$Node) {
    _inherits(RemoteNode, _PN$Node);

    function RemoteNode() {
      _classCallCheck(this, RemoteNode);

      return _possibleConstructorReturn(this, (RemoteNode.__proto__ || Object.getPrototypeOf(RemoteNode)).apply(this, arguments));
    }

    return RemoteNode;
  }(PN.Node);

  RemoteNode.groupName = 'iot buttons';
  PN.nodes.registerType("iot buttons", RemoteNode);

  PN.events.on("rpc_remote_button_click", function (data) {
    // console.log('rpc_remote_button_click', data);
    PN.nodes.eachNode(function (n) {
      if (n.type === 'iot buttons') {
        // console.log('sending button');
        n.send({
          topic: 'iot buttons',
          type: data.params[0],
          payload: data.params[1]
        });
      }
    });
  });

  var SliderNode = function (_PN$Node2) {
    _inherits(SliderNode, _PN$Node2);

    function SliderNode() {
      _classCallCheck(this, SliderNode);

      return _possibleConstructorReturn(this, (SliderNode.__proto__ || Object.getPrototypeOf(SliderNode)).apply(this, arguments));
    }

    return SliderNode;
  }(PN.Node);

  SliderNode.groupName = 'iot sliders';
  PN.nodes.registerType("iot sliders", SliderNode);

  PN.events.on("rpc_remote_slider-change", function (data) {
    // console.log('rpc_remote_button_click', data);
    PN.nodes.eachNode(function (n) {
      if (n.type === 'iot sliders') {
        // console.log('sending button');
        n.send({
          topic: 'iot sliders',
          type: data.params[0],
          slider: data.params[1],
          payload: data.params[2]
        });
      }
    });
  });
};