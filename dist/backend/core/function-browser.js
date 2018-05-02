'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//var babel = require('babel');
var _ = require('lodash');
var globalContext = require('../globalContext');

var WW_SCRIPT = './function-worker.bundle.js';

module.exports = function (PN) {
  var FunctionNode = function (_PN$Node) {
    _inherits(FunctionNode, _PN$Node);

    function FunctionNode(n) {
      _classCallCheck(this, FunctionNode);

      var _this = _possibleConstructorReturn(this, (FunctionNode.__proto__ || Object.getPrototypeOf(FunctionNode)).call(this, n));

      var node = _this;
      node.name = n.name;
      node.func = n.func;
      node.context = {};
      node.worker = new Worker(WW_SCRIPT);
      node.topic = n.topic;
      node.on('close', function () {
        console.log('terminating worker for ', node.id);
        node.worker.terminate();
      });
      node.worker.onmessage = function (evt) {
        // console.log('message recieved from worker', evt);
        try {
          var data = evt.data;
          var type = data.type;

          if (type === 'result' && data.results) {
            node.send(data.results);
          } else if (type === 'error') {
            node.error(new Error(data.message));
          } else if (type === 'warn') {
            node.warn(data.error);
          } else if (type === 'log') {
            node.log(data.msg);
          } else if (type === 'status') {
            node.status(data.status);
          } else if (type === 'send' && data.msg) {
            node.send(data.msg);
          } else if (type === 'contextSet' && data.rpcId) {
            node.context[data.key] = data.value;
            node.worker.postMessage({ rpcId: data.rpcId, type: 'rpc' });
          } else if (type === 'contextGet' && data.rpcId) {
            var value = node.context[data.key];
            node.worker.postMessage({ rpcId: data.rpcId, type: 'rpc', value: value });
          } else if (type === 'globalSet' && data.rpcId) {
            globalContext[data.key] = data.value;
            node.worker.postMessage({ rpcId: data.rpcId, type: 'rpc' });
          } else if (type === 'globalGet' && data.rpcId) {
            var _value = globalContext[data.key];
            node.worker.postMessage({ rpcId: data.rpcId, type: 'rpc', value: _value });
          } else if (type === 'flowSet' && data.rpcId) {
            PN.context.flow.set(data.key, data.value);
            node.worker.postMessage({ rpcId: data.rpcId, type: 'rpc' });
          } else if (type === 'flowGet' && data.rpcId) {
            var _value2 = PN.context.flow.get(data.key);
            node.worker.postMessage({ rpcId: data.rpcId, type: 'rpc', value: _value2 });
          }
        } catch (exp) {
          node.error(exp);
        }
      };

      try {
        node.on("input", function (msg) {
          try {
            var execId = '_' + Math.random() + '_' + Date.now();
            node.worker.postMessage({ msg: msg, execId: execId, func: node.func, type: 'run' });
          } catch (err) {
            node.error(err);
          }
        });
      } catch (err) {
        // eg SyntaxError - which v8 doesn't include line number information
        // so we can't do better than this
        node.error(err);
      }
      return _this;
    }

    return FunctionNode;
  }(PN.Node);

  PN.nodes.registerType("function", FunctionNode);
};