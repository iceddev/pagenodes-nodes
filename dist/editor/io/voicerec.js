'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('voice rec', {
    category: 'input',
    color: "#ffb6c1",
    defaults: {
      name: { value: "" }
    },
    inputs: 0,
    outputs: 1,
    faChar: '&#xf118;', //smile-o
    label: function label() {
      return this.name || 'voice rec';
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-name' },
            React.createElement('i', { className: 'fa fa-tag' }),
            React.createElement('span', { 'data-i18n': 'common.label.name' })
          ),
          React.createElement('input', {
            type: 'text',
            id: 'node-input-name',
            'data-i18n': '[placeholder]common.label.name' })
        ),
        React.createElement(
          'div',
          { className: 'form-tips', id: 'tip-json', hidden: true },
          React.createElement('span', { 'data-i18n': 'httpin.tip.req' })
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
          'This node can be used for voice recognition.  If you want to ouput text to speech, or perhaps even sending text to speech into another p2p client.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Creates a Speech Recognition Node that is always on'
      );
    }
  });
};