'use strict';

module.exports = function (PN) {

  PN.nodes.registerType('mqtt in', {
    category: 'input',
    defaults: {
      name: { value: "" },
      topic: { value: "", required: true },
      broker: { type: "mqtt-broker", required: true }
    },
    color: "#D8BFD8",
    inputs: 0,
    outputs: 1,
    faChar: "&#xf09e;", //rss
    label: function label() {
      return this.name || this.topic || "mqtt";
    },
    oneditprepare: function oneditprepare() {},
    oneditsave: function oneditsave(a) {

      console.log('saving', this, a);
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'label',
              { htmlFor: 'node-input-broker' },
              React.createElement('i', { className: 'fa fa-globe' }),
              ' Broker'
            ),
            React.createElement('input', { type: 'text', id: 'node-input-broker' })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'label',
              { htmlFor: 'node-input-topic' },
              React.createElement('i', { className: 'fa fa-tag' }),
              ' Topic'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'node-input-topic',
              placeholder: 'topic' })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'label',
              { htmlFor: 'node-input-name' },
              React.createElement('i', { className: 'fa fa-tag' }),
              ' Name'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'node-input-name',
              placeholder: 'Name' })
          )
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
          'Connects to a broker and subscribes to the specified topic.'
        ),
        React.createElement(
          'p',
          null,
          'Outputs a message with the properties:'
        ),
        React.createElement(
          'ul',
          null,
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'msg.topic'
            )
          ),
          React.createElement(
            'li',
            null,
            React.createElement(
              'code',
              null,
              'msg.payload'
            )
          )
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'code',
            null,
            'msg.payload'
          ),
          ' will be a String, unless it is detected as a binary buffer.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'mqtt input node.'
      );
    }
  });

  PN.nodes.registerType('mqtt out', {
    category: 'output',
    defaults: {
      name: { value: "" },
      topic: { value: "", required: false },
      broker: { type: "mqtt-broker", required: true }
    },
    color: "#D8BFD8",
    inputs: 1,
    outputs: 0,
    faChar: "&#xf09e;", //rss
    align: "right",
    label: function label() {
      return this.name || this.topic || "mqtt";
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic mqttNode" : "mqttNode";
    },
    oneditprepare: function oneditprepare() {},
    oneditsave: function oneditsave(a) {

      console.log('saving', this, a);
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'label',
              { htmlFor: 'node-input-broker' },
              React.createElement('i', { className: 'fa fa-globe' }),
              ' Broker'
            ),
            React.createElement('input', { type: 'text', id: 'node-input-broker' })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'label',
              { htmlFor: 'node-input-topic' },
              React.createElement('i', { className: 'fa fa-tag' }),
              ' Topic'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'node-input-topic',
              placeholder: 'topic' })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'label',
              { htmlFor: 'node-input-name' },
              React.createElement('i', { className: 'fa fa-tag' }),
              ' Name'
            ),
            React.createElement('input', { type: 'text',
              id: 'node-input-name',
              placeholder: 'Name' })
          )
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
          'Connects to a MQTT broker and publishes messages.'
        ),
        React.createElement(
          'p',
          null,
          'The topic used can be configured in the node or, if left blank, can be set by ',
          React.createElement(
            'code',
            null,
            'msg.topic'
          ),
          '.'
        ),
        React.createElement(
          'p',
          null,
          'Likewise the QoS and retain values can be configured in the node or, if left blank, set by ',
          React.createElement(
            'code',
            null,
            'msg.qos'
          ),
          ' and ',
          React.createElement(
            'code',
            null,
            'msg.retain'
          ),
          ' respectively. By default, messages are published at QoS 0 with the retain flag set to false.'
        ),
        React.createElement(
          'p',
          null,
          'If ',
          React.createElement(
            'code',
            null,
            'msg.payload'
          ),
          ' contains an object it will be converted to JSON before being sent.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'mqtt Out'
      );
    }
  });

  PN.nodes.registerType('mqtt-broker', {
    category: 'config',
    defaults: {
      server: { value: "", required: true },
      clientId: { value: "", required: false },
      username: { value: "", required: false },
      password: { value: "", required: false }
    },
    label: function label() {
      return this.name || this.server || 'mqtt broker';
    },
    oneditprepare: function oneditprepare(a) {},
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'form-row node-input-server' },
            React.createElement(
              'label',
              { htmlFor: 'node-config-input-server' },
              React.createElement('i', { className: 'fa fa-globe' }),
              ' server'
            ),
            React.createElement('input', {
              className: 'input-append-left',
              type: 'text',
              id: 'node-config-input-server',
              placeholder: 'wss://my_mqtt_broker:443' })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'label',
              { htmlFor: 'node-config-input-clientId' },
              React.createElement('i', { className: 'fa fa-tag' }),
              ' client Id'
            ),
            React.createElement('input', { type: 'text', id: 'node-config-input-clientId' })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'label',
              { htmlFor: 'node-config-input-username' },
              React.createElement('i', { className: 'fa fa-user' }),
              ' username'
            ),
            React.createElement('input', { type: 'text', id: 'node-config-input-username' })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'label',
              { htmlFor: 'node-config-input-password' },
              React.createElement('i', { className: 'fa fa-lock' }),
              ' password'
            ),
            React.createElement('input', { type: 'password', id: 'node-config-input-password' })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'label',
              { htmlFor: 'node-input-name' },
              React.createElement('i', { className: 'fa fa-tag' }),
              ' Name'
            ),
            React.createElement('input', { type: 'text',
              id: 'node-input-name',
              placeholder: 'Name' })
          )
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'mqtt connection node'
      );
    }
  });
};