'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('iot buttons', {
    order: 2,
    category: 'input',
    color: "#a6bbcf",
    defaults: {},
    inputs: 0,
    outputs: 1,
    faChar: '&#xf00a;', //th
    // faColor: 'red',
    label: function label() {
      return this.name || 'iot buttons';
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'form-tips' },
          'Simply switch to ',
          React.createElement(
            'code',
            null,
            'IoT Remote Buttons'
          ),
          ' view in the PageNodes menu to send button clicks from this node.'
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
          'When you switch to the ',
          React.createElement(
            'code',
            null,
            'IoT Remote Buttons'
          ),
          ' view from the PageNodes menu, this node will send the button clicks out to other nodes you connect.'
        ),
        React.createElement(
          'p',
          null,
          'A message from this node will have a ',
          React.createElement(
            'code',
            null,
            'topic'
          ),
          ', ',
          React.createElement(
            'code',
            null,
            'type'
          ),
          ', and ',
          React.createElement(
            'code',
            null,
            'payload'
          ),
          '. ',
          React.createElement('br', null),
          ' For example, the Number 1 button will have a ',
          React.createElement(
            'code',
            null,
            'payload'
          ),
          ' of ',
          React.createElement(
            'code',
            null,
            '1'
          ),
          '.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'IoT Remote Control Buttons'
      );
    }
  });

  PN.nodes.registerType('iot sliders', {
    order: 3,
    category: 'input',
    color: "#a6bbcf",
    defaults: {},
    inputs: 0,
    outputs: 1,
    faChar: '&#xf1de;', //sliders
    // faColor: 'red',
    label: function label() {
      return this.name || 'iot sliders';
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'form-tips' },
          'Simply switch to ',
          React.createElement(
            'code',
            null,
            'IoT Remote Buttons'
          ),
          ' view in the PageNodes menu to send slider changes from this node.'
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
          'When you switch to the ',
          React.createElement(
            'code',
            null,
            'IoT Remote Buttons'
          ),
          ' view from the PageNodes menu, this node will send the slider changes out to other nodes you connect.'
        ),
        React.createElement(
          'p',
          null,
          'A message from this node will have a ',
          React.createElement(
            'code',
            null,
            'topic'
          ),
          ', ',
          React.createElement(
            'code',
            null,
            'type'
          ),
          ', ',
          React.createElement(
            'code',
            null,
            'slider'
          ),
          ', and ',
          React.createElement(
            'code',
            null,
            'payload'
          ),
          '. ',
          React.createElement('br', null),
          ' For example, the Number 1 slider will have a ',
          React.createElement(
            'code',
            null,
            'slider'
          ),
          ' of ',
          React.createElement(
            'code',
            null,
            '1'
          ),
          ', and its ',
          React.createElement(
            'code',
            null,
            'payload'
          ),
          ' of the new value of the slider.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'IoT Remote Control Buttons'
      );
    }
  });
};