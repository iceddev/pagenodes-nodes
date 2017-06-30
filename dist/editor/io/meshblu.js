'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (PN) {
  var _PN$components = PN.components,
      NameRow = _PN$components.NameRow,
      TextRow = _PN$components.TextRow;


  function meshbluShortenName(input, length, defaultName) {
    input = input || defaultName;
    if (input && input.length > length) {
      return input.substring(0, length);
    }
    return input;
  }

  function meshbluFormatDevice(device) {
    var text = '';
    if (device) {
      text += device.uuid;
      text += ' -' + (device.name || 'NO_NAME');
      text += ' -' + (device.type || 'NO_TYPE');
      text += ' -' + device.owner;
    }
    return text;
  }

  function meshbluDeviceSearch(mesbhluNode) {

    $('#node-input-lookup-uuid').click(function () {

      try {
        var serverId = $("#node-input-server").val() || mesbhluNode.server;
        var server;
        if (serverId && serverId.length > 5) {
          $('#node-input-lookup-uuid-icon').attr('class', 'icon icon-time');
          PN.nodes.eachConfig(function (n) {
            console.log(n.id, serverId);
            if (n.id === serverId) {
              console.log('found', n);
              server = n;
            }
          });
          PN.comms.rpc('meshblu/getDevices', [{
            server: server.server,
            port: server.port,
            uuid: server.uuid,
            token: server.token
          }], function (data) {
            if (data.error) {
              $('#node-input-lookup-uuid-icon').attr('class', 'icon icon-warning-sign');
              console.log('error searching', err);
              return;
            }

            console.log('getDevices', data);

            $('#node-input-lookup-uuid-icon').attr('class', 'icon icon-search');

            var deviceMap = {};
            var deviceList = $('#uuidDevices');
            $('#serverName').html(meshbluShortenName(server.uuid, 18) + '@' + meshbluShortenName(server.server + ":" + server.port, 50));
            console.log('getDevices', data);
            deviceList.find('option').remove();
            var devices = data || [];
            for (var i = 0; i < devices.length; i++) {
              deviceMap[devices[i].uuid] = devices[i];
              var text = meshbluFormatDevice(devices[i]);
              var op = $("<option></option>").attr("value", devices[i].uuid).text(text);

              $('#uuidDevices').append(op);
              console.log('uuidDevices', devices[i].owner);
            }
            deviceList.change(function (a) {
              var selectedDevice = deviceMap[deviceList.val()];
              if (selectedDevice && selectedDevice.owner === 'UNCLAIMED') {
                $('#node-input-claim-uuid').show();
              } else {
                $('#node-input-claim-uuid').hide();
              }
            });
            launchDialog();
            $("#node-input-claim-uuid").unbind();
            $('#node-input-claim-uuid').click(function () {
              var selectedDevice = deviceMap[deviceList.val()];
              if (selectedDevice) {
                PN.comms.rpc('meshblu/claim', [{
                  server: server.server,
                  port: server.port,
                  uuid: server.uuid,
                  token: server.token,
                  toClaim: selectedDevice.uuid
                }], function (data) {
                  if (data.error) {
                    console.log('error claiming', data.error);
                    return;
                  }
                  deviceList.children().each(function (id, option) {
                    if (data.uuid === option.value) {
                      deviceMap[data.uuid].owner = 'MINE';
                      option.text = meshbluFormatDevice(deviceMap[data.uuid]);
                    }
                  });
                  var text = meshbluFormatDevice(devices[i]);
                });
              }
            });
          });
        }
      } catch (ex) {
        console.log('error loading uuid devices', ex);
      }

      function launchDialog() {
        var dialog = $("#uuidListDialog");
        dialog.dialog({
          modal: true,
          width: 'auto',
          buttons: [{
            text: "OK",
            click: function click() {
              var selectedVal = $("#uuidDevices").val();
              console.log('selectedVal', selectedVal);
              if (selectedVal) {
                $("#node-input-uuid").val(selectedVal);
              }
              $(this).dialog("close");
            }
          }, {
            text: "CANCEL",
            click: function click() {
              $(this).dialog("close");
            }
          }]
        });
      }
    });
  }

  PN.nodes.registerType('meshblu in', {
    category: 'input',
    defaults: {
      name: { value: "" },
      directToMe: { value: true },
      uuid: { value: "" },
      server: { type: "meshblu-server", required: true }
    },
    color: "#76be43",
    inputs: 0,
    outputs: 1,
    faChar: "&#xf069;", //asterisk
    faColor: '#172B6F',
    fontColor: '#172B6F',
    label: function label() {
      return this.name || this.topic || "meshblu";
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic meshbluNode" : "meshbluNode";
    },
    oneditprepare: function oneditprepare() {
      var self = this;
      if (self.server) {
        PN.nodes.eachConfig(function (n) {
          console.log(n.id, self.server);
          if (n.id === self.server) {
            console.log('found', n);
            $("#node-spand-directToMe-uuid").html(n.uuid);
          }
        });
      }

      function showDevice() {
        $("#node-div-deviceRow").show();
      }
      function hideDevice() {
        $("#node-div-deviceRow").hide();
      }

      var directToMe = $("#node-input-directToMe");
      directToMe.change(function () {
        console.log('directToMe checked', this.checked);
        if (this.checked) {
          hideDevice();
        } else {
          showDevice();
        }
      });

      if (this.directToMe) {
        directToMe.checked = 'checked';
        hideDevice();
      } else {
        directToMe.checked = '';
        showDevice();
      }
      meshbluDeviceSearch(self);
    },
    oneditsave: function oneditsave(a) {
      var direct = $("#node-input-directToMe");
      if (direct.is(':checked')) {
        this.directToMe = true;
      } else {
        this.directToMe = false;
      }
      console.log('saving', this, a);
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'server', icon: 'globe' }),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-directToMe' },
            React.createElement('i', { className: 'fa fa-user' }),
            ' Direct to Me?'
          ),
          React.createElement('input', {
            type: 'checkbox',
            id: 'node-input-directToMe',
            style: { width: 30, height: '1.7em' } }),
          React.createElement('span', {
            id: 'node-spand-directToMe-uuid',
            className: 'selectable' })
        ),
        React.createElement(
          'div',
          { className: 'form-row', id: 'node-div-deviceRow' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-uuid' },
            React.createElement('i', { className: 'fa fa-asterisk' }),
            ' A broadcast from'
          ),
          React.createElement('input', {
            type: 'text',
            id: 'node-input-uuid',
            placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            style: { width: '62%' } }),
          React.createElement(
            'a',
            { id: 'node-input-lookup-uuid', className: 'btn' },
            React.createElement('i', {
              className: 'icon icon-search',
              id: 'node-input-lookup-uuid-icon' })
          )
        ),
        React.createElement(NameRow, null),
        React.createElement(
          'div',
          { id: 'uuidListDialog', title: 'Searching devices...', className: 'hide' },
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement('span', { id: 'serverName' })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement('select', {
              id: 'uuidDevices',
              size: 7,
              style: { width: '50em', fontFamily: 'Courier, monospace' } })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'a',
              {
                id: 'node-input-claim-uuid',
                className: 'btn',
                style: { display: 'none' } },
              'claim'
            ),
            React.createElement('span', { id: 'claimOutput' })
          )
        )
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'p',
        null,
        'meshblu input node. Connects to a server and either receives messages sent directly to the connected uuid or subscribes to broadcasts from a specified uuid.'
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'meshblu input node.'
      );
    }
  });

  PN.nodes.registerType('meshblu out', {
    category: 'output',
    defaults: {
      name: { value: "" },
      uuid: { value: "" },
      broadcast: { value: true },
      forwards: { value: false },
      outputs: { value: 0 },
      server: { type: "meshblu-server", required: true }
    },
    color: "#76be43",
    inputs: 1,
    outputs: 0,
    faChar: "&#xf069;", //asterisk
    faColor: '#172B6F',
    fontColor: '#172B6F',
    align: "right",
    label: function label() {
      return this.name || this.topic || "meshblu";
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic meshbluNode" : "meshbluNode";
    },
    oneditprepare: function oneditprepare() {

      var self = this;

      var forwardsChbx = $("#node-input-forwards");
      if (this.forwards) {
        forwardsChbx.checked = 'checked';
      } else {
        forwardsChbx.checked = '';
      }

      function showDevice() {
        $("#node-div-deviceRow").show();
        $("#node-div-outputsRow").show();
      }
      function hideDevice() {
        $("#node-div-deviceRow").hide();
        $("#node-div-outputsRow").hide();
      }

      var broadcast = $("#node-input-broadcast");
      broadcast.change(function () {
        console.log('broadcast checked', this.checked);
        if (this.checked) {
          hideDevice();
        } else {
          showDevice();
        }
      });

      if (this.broadcast) {
        broadcast.checked = 'checked';
        hideDevice();
      } else {
        broadcast.checked = '';
        showDevice();
      }

      meshbluDeviceSearch(self);
    },
    oneditsave: function oneditsave(a) {
      var broadcastChbx = $("#node-input-broadcast");
      if (broadcastChbx.is(':checked')) {
        this.broadcast = true;
      } else {
        this.broadcast = false;
      }
      var forwardsChbx = $("#node-input-forwards");
      if (forwardsChbx.is(':checked')) {
        console.log('forwards', forwardsChbx.is(':checked'));
        this.outputs = 1;
        this.forwards = true;
      } else {
        console.log('doesnt forward', forwardsChbx.is(':checked'));
        this.outputs = 0;
        this.forwards = false;
      }

      console.log('saving', this, a);
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(TextRow, { name: 'server', icon: 'globe' }),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-broadcast' },
            React.createElement('i', { className: 'fa fa-asterisk' }),
            ' broadcast?'
          ),
          React.createElement('input', {
            type: 'checkbox',
            id: 'node-input-broadcast',
            style: { width: 30, height: '1.7em' } })
        ),
        React.createElement(
          'div',
          { className: 'form-row', id: 'node-div-deviceRow' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-uuid' },
            React.createElement('i', { className: 'fa fa-user' }),
            ' To a specific uuid'
          ),
          React.createElement('input', {
            type: 'text',
            id: 'node-input-uuid',
            placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            style: { width: '62%' } }),
          React.createElement(
            'a',
            { id: 'node-input-lookup-uuid', className: 'btn' },
            React.createElement('i', {
              className: 'icon icon-search',
              id: 'node-input-lookup-uuid-icon' })
          )
        ),
        React.createElement(
          'div',
          {
            className: 'form-row',
            id: 'node-div-outputsRow' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-forwards' },
            React.createElement('i', { className: 'icon-share-alt' }),
            ' Forward Response?'
          ),
          React.createElement('input', {
            type: 'checkbox',
            id: 'node-input-forwards',
            style: { width: 30, height: '1.7em' } })
        ),
        React.createElement(NameRow, null),
        React.createElement(
          'div',
          { id: 'uuidListDialog', title: 'Searching devices...', className: 'hide' },
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement('span', { id: 'serverName' })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement('select', {
              id: 'uuidDevices',
              size: 7,
              style: { width: '50em', fontFamily: 'Courier, monospace' } })
          ),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'a',
              {
                id: 'node-input-claim-uuid',
                className: 'btn',
                style: { display: 'none' } },
              'claim'
            ),
            React.createElement('span', { id: 'claimOutput' })
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
          'Connects to a meshblu server and either broadcasts out the ',
          React.createElement(
            'b',
            null,
            'msg'
          ),
          ' to any subscribers or sends the ',
          React.createElement(
            'b',
            null,
            'msg'
          ),
          ' to a specific device.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Meshblu Out'
      );
    }
  });

  PN.nodes.registerType('meshblu-server', {
    category: 'config',
    defaults: {
      server: { value: "meshblu-socket-io.octoblu.com", required: true },
      port: { value: 443, required: true, validate: PN.validators.number() },
      uuid: { value: "", required: true },
      token: { value: "", required: true }
    },
    label: function label() {
      if (this.server == "") {
        this.server = "none";
      }
      return meshbluShortenName(this.uuid, 6) + '@' + meshbluShortenName(this.server + ":" + this.port, 25);
    },
    oneditprepare: function oneditprepare(a) {
      var generateButton = $('#node-config-input-generate');

      generateButton.click(function () {
        var messageArea = $('#node-config-input-messageArea');
        messageArea.html('generating...');
        PN.comms.rpc('meshblu/register', [{
          server: $('#node-config-input-server').val(),
          port: $('#node-config-input-port').val()
        }], function (data) {
          console.log('data', data);
          if (data.error) {
            if ((typeof err === 'undefined' ? 'undefined' : _typeof(err)) === 'object') {
              try {
                err = JSON.stringify(err);
              } catch (ex) {}
            }
            messageArea.html('error: ' + err);
            return;
          }
          if (data && data.uuid && data.token) {
            $('#node-config-input-uuid').val(data.uuid);
            $('#node-config-input-token').val(data.token);
          }
          messageArea.html('ok');
        });
      });
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
              placeholder: 'localhost',
              style: { width: '40%' } }),
            React.createElement(
              'label',
              {
                htmlFor: 'node-config-input-port',
                style: { marginLeft: 10, width: 35 } },
              ' Port'
            ),
            React.createElement('input', {
              type: 'text',
              id: 'node-config-input-port',
              placeholder: 'Port',
              style: { width: 45 } })
          ),
          React.createElement(TextRow, { name: 'uuid', config: true, icon: 'user' }),
          React.createElement(TextRow, { name: 'token', config: true, icon: 'lock' }),
          React.createElement(
            'div',
            { className: 'form-row' },
            React.createElement(
              'a',
              {
                href: '#',
                className: 'btn',
                id: 'node-config-input-generate' },
              'Create UUID/Token'
            ),
            React.createElement('span', { id: 'node-config-input-messageArea' })
          )
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Meshblu connection node'
      );
    }
  });
};