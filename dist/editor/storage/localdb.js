'use strict';

module.exports = function (PN) {
  var _PN$components = PN.components,
      NameRow = _PN$components.NameRow,
      TextRow = _PN$components.TextRow;


  PN.nodes.registerType('localwrite', {
    category: 'storage',
    color: "#7E57C2",
    defaults: {
      name: {
        value: ""
      },
      append: {
        value: ''
      },
      key: {
        value: "",
        required: true
      }
    },
    inputs: 1,
    outputs: 0,
    //icon: "leveldb.png",
    faChar: '&#xf1c0;', //database
    fontColor: "#FFF",
    faColor: "#FFF",
    label: function label() {
      return this.name || "localwrite";
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'key', icon: 'tag' }),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            null,
            '\xA0'
          ),
          React.createElement('input', {
            type: 'checkbox',
            id: 'node-input-append',
            style: { display: 'inline-block', width: 'auto', verticalAlign: 'top' } }),
          React.createElement('label', {
            htmlFor: 'node-input-append',
            style: { width: '70%' },
            'data-i18n': 'common.label.append' })
        ),
        React.createElement(NameRow, null)
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'Writes to local storage utilizing localforage.'
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'a',
            { href: 'https://mozilla.github.io/localForage' },
            'https://mozilla.github.io/localForage'
          )
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Writes data to local storage'
      );
    }
  });

  PN.nodes.registerType('localread', {
    category: 'storage',
    color: "#7E57C2",
    defaults: {
      name: {
        value: ""
      },
      key: {
        value: "",
        required: true
      }
    },
    inputs: 1,
    outputs: 1,
    faChar: '&#xf1c0;', //database
    fontColor: "#FFF",
    faColor: "#FFF",
    label: function label() {
      return this.name || "localread";
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'key', icon: 'tag' }),
        React.createElement(NameRow, null)
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'Retrieves a payload based off of its key with localforage.  Output will be sent to console.log as well.'
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'a',
            { href: 'https://mozilla.github.io/localForage' },
            'https://mozilla.github.io/localForage'
          )
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Reads data in localStorage'
      );
    }
  });
};