'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('unknown', {
    category: 'unknown',
    color: "#fff0f0",
    defaults: {
      name: { value: "" }
    },
    inputs: 1,
    outputs: 1,
    icon: "",
    label: function label() {
      return "(" + this.name + ")" || this._("unknown.label.unknown");
    },
    labelStyle: function labelStyle() {
      return "node_label_unknown";
    }
  });
};