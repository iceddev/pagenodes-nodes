'use strict';

module.exports = function (PN) {
  var _PN$components = PN.components,
      NameRow = _PN$components.NameRow,
      TextRow = _PN$components.TextRow,
      SearchTextRow = _PN$components.SearchTextRow;


  PN.nodes.registerType('serial in', {
    category: 'hardware',
    defaults: {
      name: { value: "" },
      connection: { type: "serial-port", required: true }
    },
    color: "BurlyWood",
    inputs: 0,
    outputs: 1,
    faChar: "&#xf287;", //usb
    label: function label() {
      return this.name || this.topic || "serial";
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'connection', icon: 'globe' }),
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
          'Connects to a webusb, serial, or tcp port.'
        ),
        React.createElement(
          'p',
          null,
          'Emits binary (Buffer) data recieved on the port.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'serial input node.'
      );
    }
  });

  PN.nodes.registerType('serial out', {
    category: 'hardware',
    defaults: {
      name: { value: "" },
      topic: { value: "", required: false },
      connection: { type: "serial-port", required: true }
    },
    color: "BurlyWood",
    inputs: 1,
    outputs: 0,
    faChar: "&#xf287;", //usb
    align: "right",
    label: function label() {
      return this.name || this.topic || "serial";
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'connection', icon: 'globe' }),
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
          'Connects to a webusb, serial, or tcp port.'
        ),
        React.createElement(
          'p',
          null,
          'Writes binary (Buffer) data directly to the port.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'serial Out'
      );
    }
  });

  PN.nodes.registerType('serial-port', {
    category: 'config',
    defaults: {
      connectionType: { value: "webusb", required: true },
      serialportName: { value: "", required: false },
      baud: { value: "57600", required: false },
      inputId: { value: "", required: false },
      ouputId: { value: "", required: false },
      vendorId: { value: "", required: false },
      productId: { value: "", required: false },
      tcpHost: { value: "", required: false },
      tcpPort: { value: "", required: false },
      name: { value: "" }
    },
    label: function label() {
      return this.name || this.server || 'serial connection';
    },
    oneditprepare: function oneditprepare(a) {

      $('#needHardwareExtensionDiv').hide();
      $('#hardwareExtensionOkDiv').hide();
      $('#hardwareExtensionFirmwareDiv').hide();

      PN.comms.rpc('pluginActive', [], function (result) {
        if (result.status) {
          $('#hardwareExtensionOkDiv').show();
          $('#hardwareExtensionFirmwareDiv').show();
        } else {
          $('#needHardwareExtensionDiv').show();
        }
      });

      PN.searchField({
        name: 'serialportName',
        rpc: 'gpio/listSerial',
        config: true
      });

      PN.searchField({
        name: 'inputId',
        rpc: 'midi/listInputIDs',
        config: true
      });

      PN.searchField({
        name: 'outputId',
        rpc: 'midi/listOutputIDs',
        config: true
      });

      var usbOutput = $("#node-config-lookup-usb-output");
      //web usb handling
      if (navigator.usb) {
        navigator.usb.getDevices().then(function (devices) {
          usbOutput.html('Authorized Devices: ' + devices.length);
        }).catch(function (err) {
          usbOutput.html(err);
        });

        $("#node-config-lookup-usb").click(function () {
          var DEFAULT_FILTERS = [{ 'vendorId': 0x2341, 'productId': 0x8036 }, { 'vendorId': 0x2341, 'productId': 0x8037 }, { 'vendorId': 0x239a, 'productId': 0x8011 }];

          navigator.usb.requestDevice({ filters: DEFAULT_FILTERS }).then(function (device) {
            console.log('authorized device', device);
            navigator.usb.getDevices().then(function (devices) {
              usbOutput.html('Authorized Devices: ' + devices.length);
            }).catch(function (err) {
              usbOutput.html(err);
            });
          }).catch(function (err) {
            usbOutput.html(err);
          });
        });
      } else {
        usbOutput.html('Web USB API not enabled in this browser');
      }

      var typeOptions = ['usb', 'productId', 'vendorId', 'serialportName', 'plugin', 'baud', 'tcpHost', 'tcpPort', 'inputId', 'outputId'];
      var typeToggles = {
        webusb: ['usb', 'productId', 'vendorId'],
        serial: ['serialportName', 'plugin', 'baud'],
        tcp: ['tcpHost', 'tcpPort', 'plugin'],
        splidi: ['inputId', 'outputId']
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
              { value: 'webusb' },
              'WebUSB Serial'
            ),
            React.createElement(
              'option',
              { value: 'splidi' },
              'Splidi Serial'
            ),
            React.createElement(
              'option',
              { value: 'serial' },
              'Serial Port (plugin)'
            ),
            React.createElement(
              'option',
              { value: 'tcp' },
              'TCP (plugin)'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'form-row', id: 'node-div-pluginRow' },
          React.createElement('label', null),
          React.createElement(
            'div',
            { id: 'needHardwareExtensionDiv', className: 'form-tips' },
            'This option requires you to have the ',
            React.createElement(
              'a',
              { href: 'https://chrome.google.com/webstore/detail/hardware-extension-for-pa/knmappkjdfbfdomfnbfhchnaamokjdpj', target: '_blank' },
              React.createElement(
                'span',
                { className: 'hardwareExtension' },
                'Chrome Hardware Extension'
              )
            ),
            ' installed.'
          ),
          React.createElement(
            'div',
            { id: 'hardwareExtensionOkDiv', className: 'form-tips' },
            'Hardware Extension is active ',
            React.createElement('i', { className: 'fa fa-thumbs-up' })
          )
        ),
        React.createElement(SearchTextRow, { name: 'serialportName', placeholder: 'e.g. /dev/ttyUSB0  COM1', label: 'Port', config: true, icon: 'random' }),
        React.createElement(TextRow, { name: 'baud', placeholder: '57600', config: true }),
        React.createElement(
          'div',
          { className: 'form-row', id: 'node-div-usbRow' },
          React.createElement(
            'label',
            { htmlFor: 'node-config-input-usbName' },
            'Authorize USB'
          ),
          React.createElement(
            'span',
            { id: 'node-config-lookup-usb-output' },
            '...'
          ),
          React.createElement(
            'a',
            { id: 'node-config-lookup-usb', className: 'btn' },
            React.createElement('i', {
              id: 'node-config-lookup-usb-icon',
              className: 'fa fa-random' })
          )
        ),
        React.createElement(TextRow, { name: 'vendorId', placeholder: '0x2341', config: true }),
        React.createElement(TextRow, { name: 'productId', placeholder: '0x8036', config: true }),
        React.createElement(TextRow, { name: 'tcpHost', label: 'Host', config: true }),
        React.createElement(TextRow, { name: 'tcpPort', label: 'port number', config: true }),
        React.createElement(SearchTextRow, { name: 'inputId', icon: 'tag', config: true }),
        React.createElement(SearchTextRow, { name: 'outputId', icon: 'tag', config: true }),
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