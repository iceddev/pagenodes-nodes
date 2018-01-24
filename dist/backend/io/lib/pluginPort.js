'use strict';

var stream = require('stream');
var util = require('util');

module.exports = function (PN) {

  function PluginSerialPort(type, name, options) {

    console.log('new PluginSerialPort', type, name, options);

    var self = this;
    self.type = type;
    self.name = name;
    self.options = options;

    self.dataListener = function (data) {
      // console.log('plugin data from wire', new Buffer(data).toString('hex'));
      self.emit('data', new Buffer(data));
    };

    var eventName = 'data_' + self.type + '_' + self.name;

    PN.events.on(eventName, self.dataListener);

    console.log('PluginSerialPort listening for events', eventName);

    PN.plugin.rpc('connect', [type, name, options], function (result) {
      // console.log('PluginSerialPort connect result', result);
      if (result.error) {
        return self.emit('error', result.error);
      }
      self.emit('open');
    });
  }

  util.inherits(PluginSerialPort, stream.Stream);

  PluginSerialPort.prototype.open = function (callback) {
    this.emit('open');
    if (callback) {
      callback();
    }
  };

  PluginSerialPort.prototype.write = function (data, callback) {

    var self = this;

    if (!Buffer.isBuffer(data)) {
      data = new Buffer(data);
    }

    // console.log('plugin data to wire', data.toString('hex'));
    PN.plugin.postMessage({ type: 'data', conType: self.type, name: self.name, data: data });
  };

  PluginSerialPort.prototype.close = function (callback) {
    console.log('closing PluginSerialPort', callback);
    var self = this;
    PN.plugin.rpc('disconnect', [self.type, self.name], function (result) {
      if (result.error) {
        return self.emit('error', result.error);
      }
      if (callback) {
        callback();
      }
    });
    PN.events.removeListener('data_' + self.type + '_' + self.name, self.dataListener);
  };

  PluginSerialPort.prototype.flush = function (callback) {
    console.log('flush');
    if (callback) {
      callback();
    }
  };

  PluginSerialPort.prototype.drain = function (callback) {
    console.log('drain');
    if (callback) {
      callback();
    }
  };

  return {
    SerialPort: PluginSerialPort
  };
};