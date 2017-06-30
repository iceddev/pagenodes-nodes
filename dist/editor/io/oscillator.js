'use strict';

module.exports = function (PN) {

  PN.nodes.registerType('oscillator', {
    category: 'hardware',
    defaults: {
      name: { value: "", required: false },
      duration: { value: 500, required: false, validate: PN.validators.number() },
      frequency: { value: 440, required: false, validate: PN.validators.number() },
      shape: { value: 'sine', required: false },
      active: { value: true }
    },
    label: function label() {
      return this.name || this.duration || 'oscillator';
    },
    color: '#FFA07A', //Light-salmon
    inputs: 1,
    outputs: 0,
    faChar: '&#xf028;', //volume-up
    align: 'right',
    button: {
      toggle: 'active',
      onclick: function onclick() {

        var label = this.name || 'oscillator';
        var node = this;
        PN.comms.rpc('oscillator', [this.id, this.active ? 'enable' : 'disable'], function (result) {
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
            placeholder: '500' })
        ),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-frequency' },
            React.createElement('i', { className: 'fa fa-pied-piper-alt' }),
            React.createElement(
              'span',
              null,
              ' Frequency'
            )
          ),
          React.createElement('input', {
            type: 'text',
            id: 'node-input-frequency',
            placeholder: '440' })
        ),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-shape' },
            React.createElement('i', { className: 'fa fa-angle-up' }),
            ' ',
            React.createElement(
              'span',
              null,
              'Shape'
            )
          ),
          React.createElement(
            'select',
            { id: 'node-input-shape' },
            React.createElement(
              'option',
              { value: 'sine' },
              'sine'
            ),
            React.createElement(
              'option',
              { value: 'square' },
              'square'
            ),
            React.createElement(
              'option',
              { value: 'sawtooth' },
              'sawtooth'
            ),
            React.createElement(
              'option',
              { value: 'triangle' },
              'triangle'
            )
          )
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
          'The oscillator node can be connected to the output of any node.'
        ),
        React.createElement(
          'p',
          null,
          'This node uses WebAudio to play sounds with specified ',
          React.createElement(
            'code',
            null,
            'frequency'
          ),
          ', ',
          React.createElement(
            'code',
            null,
            'duration'
          ),
          ', and ',
          React.createElement(
            'code',
            null,
            'shape'
          ),
          '.  Those values can be overridden on the ',
          React.createElement(
            'code',
            null,
            'msg'
          ),
          ' object. '
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'This node will play sounds with a WebAudio Oscillator.'
      );
    }
  });
};