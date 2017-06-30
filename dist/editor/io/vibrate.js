'use strict';

module.exports = function (PN) {
  var errorMessage = 'Your browser does not support vibrate. Please use Google Chrome for this feature.';

  PN.nodes.registerType('vibrate', {
    category: 'hardware',
    defaults: {
      duration: { value: 200, required: true, validate: PN.validators.number() },
      active: { value: true }
    },
    label: function label() {
      return this.name || this.duration || 'vibrate';
    },
    color: '#C7E9C0', //Light-green
    inputs: 1,
    outputs: 0,
    faChar: '&#xf127;', //Chain-broken
    align: 'right',
    button: {
      toggle: 'active',
      onclick: function onclick() {

        var label = this.name || 'vibrate';
        var node = this;
        PN.comms.rpc('vibrate', [this.id, this.active ? 'enable' : 'disable'], function (result) {
          if (result == 200) {
            PN.notify(node._('debug.notification.activated', { label: label }), 'success');
          } else if (result == 201) {
            PN.notify(node._('debug.notification.deactivated', { label: label }), 'success');
          }
        });
      }
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
            { htmlFor: 'node-input-duration' },
            React.createElement('i', { className: 'fa fa-clock-o' }),
            React.createElement(
              'span',
              null,
              ' Duration'
            )
          ),
          React.createElement('input', {
            type: 'text',
            id: 'node-input-duration',
            'data-i18n': '[placeholder]common.label.duration' })
        ),
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
          'The vibrate node can be connected to the output of any node.'
        ),
        React.createElement(
          'p',
          null,
          'This node can be configured to vibrate for a set amount of time in milliseconds. '
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'This node will make a device (like a phone) vibrate.'
      );
    }
  });
};