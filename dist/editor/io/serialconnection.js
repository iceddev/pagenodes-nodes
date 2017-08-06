'use strict';

module.exports = function (PN) {
  var _PN$components = PN.components,
      NameRow = _PN$components.NameRow,
      TextRow = _PN$components.TextRow,
      SearchTextRow = _PN$components.SearchTextRow;


  PN.nodes.registerType('serial-port', {
    category: 'config',
    defaults: {
      connectionType: { value: "serial", required: true },
      serialportName: { value: "", required: false },
      baud: { value: "57600", required: false },
      tcpHost: { value: "", required: false },
      tcpPort: { value: "", required: false },
      name: { value: "" }
    },
    label: function label() {
      return this.name || this.server || 'serial connection';
    },
    oneditprepare: function oneditprepare(a) {

      PN.searchField({
        name: 'serialportName',
        rpc: 'gpio/listSerial',
        config: true
      });

      var typeOptions = ['serialportName', 'baud', 'tcpHost', 'tcpPort'];
      var typeToggles = {
        serial: ['serialportName', 'plugin', 'baud'],
        tcp: ['tcpHost', 'tcpPort', 'plugin']
      };

      function toggleOptions(type) {
        var rows = typeToggles[type] || [];
        typeOptions.forEach(function (row) {
          $("#node-div-" + row + "Row").hide();
          rows.forEach(function (typeOpt) {
            if (typeOpt === row) {
              $("#node-div-" + row + "Row").show();
            }
          });
        });
      }

      toggleOptions(self.connectionType);

      var connectionTypeInput = $("#node-config-input-connectionType");
      connectionTypeInput.change(function () {
        console.log('connectionTypeInput changed', this.value);
        try {
          toggleOptions(this.value);
        } catch (exp) {}
      });
    },
    oneditsave: function oneditsave(a) {
      console.log('saving serial', a, this);
    },
    render: function render() {

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'form-row', id: 'node-div-connectionTypeRow' },
          React.createElement(
            'label',
            { htmlFor: 'node-config-input-connectionType' },
            React.createElement('i', { className: 'fa fa-wrench' }),
            ' Connection'
          ),
          React.createElement(
            'select',
            { id: 'node-config-input-connectionType' },
            React.createElement(
              'option',
              { value: 'serial' },
              'Serial Port'
            ),
            React.createElement(
              'option',
              { value: 'tcp' },
              'TCP'
            )
          )
        ),
        React.createElement(SearchTextRow, { name: 'serialportName', placeholder: 'e.g. /dev/ttyUSB0  COM1', label: 'Port', config: true, icon: 'random' }),
        React.createElement(TextRow, { name: 'baud', placeholder: '57600', config: true }),
        React.createElement(TextRow, { name: 'tcpHost', label: 'Host', config: true }),
        React.createElement(TextRow, { name: 'tcpPort', label: 'port number', config: true }),
        React.createElement(NameRow, { config: true })
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'serial connection node'
      );
    }
  });
};