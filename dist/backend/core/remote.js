"use strict";

module.exports = function (PN) {
  "use strict";

  function RemoteNode(n) {

    PN.nodes.createNode(this, n);
  }

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

  function SliderNode(n) {

    PN.nodes.createNode(this, n);
  }

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