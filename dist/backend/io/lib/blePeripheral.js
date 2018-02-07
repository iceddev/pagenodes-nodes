'use strict';

var noble = require('noble/with-bindings')(require('noble/lib/webbluetooth/bindings'));
var EventEmitter = require("events").EventEmitter;

var _require = require('lodash'),
    padStart = _require.padStart;

noble.on('error', function (err) {
  console.log('noble error', err);
  api.events.emit('noble_error', err);
});

noble._bindings.on('error', function (err) {
  console.log('noble bindings error', err);
  api.events.emit('noble_error', err);
});

var api = {
  peripheral: null,
  events: new EventEmitter(),
  init: init,
  compareUUIDs: compareUUIDs,
  ready: false
};

function compareUUIDs(a, b) {
  if (typeof a === 'number') {
    a = padStart(Number(a).toString(16), 4, '0');
  }
  if (typeof b === 'number') {
    b = padStart(Number(b).toString(16), 4, '0');
  }
  a = a || '';
  b = b || '';
  a = a.toLowerCase().replace(/\-/g, '');
  b = b.toLowerCase().replace(/\-/g, '');
  return b.indexOf(a) >= 0;
}

function init(PN) {
  PN.events.on('rpc_prepublish', function (config) {
    console.log('on prepublish', config);
    var nodeList = config.params[0] || [];
    var services = [];
    var deviceNames = [];
    var searchName = void 0;
    nodeList.forEach(function (nodeConfig) {
      if (nodeConfig.deviceName) {
        deviceNames.push(nodeConfig.deviceName);
      }
      if (nodeConfig.bleServiceId) {
        services.push(nodeConfig.bleServiceId);
      } else if (nodeConfig.connectionType === 'ble-serial') {
        //TODO make this configurable
        services.push('6e400001b5a3f393e0a9e50e24dcca9e');
      }
    });
    services = _.uniq(services);
    deviceNames = _.uniq(deviceNames);
    if (deviceNames.length) {
      //just grab the first one?
      searchName = deviceNames[0];
    }
    try {

      if (api.peripheral) {
        try {
          noble.disconnect(api.peripheral.uuid);
          api.peripheral = null;
          api.ready = false;
        } catch (err) {
          api.events.emit('noble_error', err);
        }
      }

      if (services.length) {

        noble.once('discover', function (perph) {
          api.peripheral = perph;
          console.log('peripheral found!', api.peripheral);
          api.peripheral.connect(function (error) {
            if (error) {
              return console.error('error connecting to peripheral', error);
            }
            console.log('connected to peripheral', api.peripheral);

            // node.emit('peripheralConnected', peripheral);

            api.peripheral.once('servicesDiscover', function (services) {
              console.log('serivces discovered', services);
              // node.emit('servicesDiscovered', services);

              services.forEach(function (s, sidx) {
                s.once('characteristicsDiscover', function (characteristics) {
                  console.log('characteristics found', characteristics);
                  // node.emit('characteristicsDiscovered', characteristics);
                  characteristics = characteristics || [];
                  characteristics.forEach(function (c, cidx) {
                    if (!api.ready && sidx === services.length - 1 && cidx === characteristics.length - 1) {
                      process.nextTick(function () {
                        api.events.emit('ready');
                        api.ready = true;
                      });
                    }
                  });
                });
                s.discoverCharacteristics();
              });
            });

            api.peripheral.discoverServices();
          });

          api.peripheral.once('disconnect', function () {
            api.events.emit('disconnect');
          });
        });

        if (searchName) {
          services = { services: services, name: searchName };
        }

        console.log('startScanning', services);
        noble.startScanning(services, true);
        api.events.emit('noble_scan_start');
      }
    } catch (exp) {
      console.log('error creating bluetooth connection', exp);
      setTimeout(function () {
        // node.emit('connError', {});
      }, 100);
      // node.error(exp);
    }
  });
}

module.exports = api;