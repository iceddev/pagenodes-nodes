'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('exec', {
    category: 'advanced-function',
    color: "darksalmon",
    defaults: {
      command: { value: "", required: true },
      addpay: { value: true },
      append: { value: "" },
      useSpawn: { value: "" },
      name: { value: "" }
    },
    inputs: 1,
    outputs: 3,
    icon: "arrow-in.png",
    align: "right",
    label: function label() {
      return this.name || this.command;
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    }
  });
};