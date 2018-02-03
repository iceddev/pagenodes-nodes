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
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'form-tips' },
          'This node is a type unknown to your Chirpers runtime.  You may wish to remove this node from your flow, or try running this flow on a different runtime.'
        )
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'This node is a type unknown to your Chirpers runtime.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'div',
        { 'class': 'form-tips' },
        'unknown'
      );
    }
  });
};