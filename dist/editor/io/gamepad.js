'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('gamepad', {
    category: 'hardware',
    color: "#26C6DA",
    defaults: {
      name: { value: "" },
      controllerId: { value: "0", required: true },
      refreshInterval: { value: "300", required: false },
      onlyButtonChanges: { value: false, required: false },
      roundAxes: { value: true, required: false }
    },
    inputs: 0,
    outputs: 1,
    faChar: '&#xf11b;', //gamepad
    label: function label() {
      return this.name || 'gamepad';
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },
    render: function render() {
      var _PN$components = PN.components,
          NameRow = _PN$components.NameRow,
          TextRow = _PN$components.TextRow,
          SelectRow = _PN$components.SelectRow;

      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'refreshInterval', label: 'Interval (ms)', icon: 'clock-o', placeholder: '300' }),
        React.createElement(SelectRow, { name: 'controllerId', label: 'controller', icon: 'tag', options: [[1, 0], [2, 1], [3, 2], [4, 3]] }),
        React.createElement(
          'div',
          { className: 'form-row', id: 'node-roundA' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-roundAxes' },
            React.createElement('i', { className: 'fa fa-arrows' }),
            React.createElement('span', null)
          ),
          React.createElement('input', {
            type: 'checkbox',
            id: 'node-input-roundAxes',
            style: { display: "inlineBlock", width: "auto", "verticalAlign": "top" } }),
          React.createElement(
            'label',
            {
              htmlFor: 'node-input-roundAxes',
              style: { width: "70%" } },
            '\xA0 Round the values on the axes.'
          )
        ),
        React.createElement(
          'div',
          { className: 'form-row', id: 'node-onlyButtonChanges' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-onlyButtonChanges' },
            React.createElement('i', { className: 'fa fa-bullseye' }),
            React.createElement('span', null)
          ),
          React.createElement('input', {
            type: 'checkbox',
            id: 'node-input-onlyButtonChanges',
            style: { display: "inlineBlock", width: "auto", "verticalAlign": "top" } }),
          React.createElement(
            'label',
            {
              htmlFor: 'node-input-onlyButtonChanges',
              style: { width: "70%" } },
            '\xA0 Only emit on button changes.'
          )
        ),
        React.createElement(NameRow, null),
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
          'This node was built for utilizing USB gamepads.  The primary package is still going to be ',
          React.createElement(
            'code',
            null,
            'msg.payload'
          ),
          '.  The easiest way to return is to create a function node and use an if statement to check if a button is set to "pressed".'
        ),
        React.createElement(
          'p',
          null,
          'The library ',
          React.createElement(
            'code',
            null,
            'navigator.gamepad'
          ),
          ' is located ',
          React.createElement(
            'a',
            { href: 'https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/buttons' },
            'here'
          ),
          '.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Gamepad Node'
      );
    }
  });
};