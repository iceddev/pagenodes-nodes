'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var STORAGE_PREFIX = 'LDB_';

module.exports = function (PN) {

  var localforage = require('localforage');
  var _ = require('lodash');

  var LocalWriteNode = function (_PN$Node) {
    _inherits(LocalWriteNode, _PN$Node);

    function LocalWriteNode(n) {
      _classCallCheck(this, LocalWriteNode);

      var _this = _possibleConstructorReturn(this, (LocalWriteNode.__proto__ || Object.getPrototypeOf(LocalWriteNode)).call(this, n));

      var node = _this;
      node.key = n.key;
      node.append = n.append;

      _this.on("input", function (msg) {
        if (msg.hasOwnProperty("payload")) {
          if (n.append) {
            localforage.getItem(STORAGE_PREFIX + node.key).then(function (value) {
              if (value) {
                console.log('initial value:', value);
                if (Array.isArray(value)) {
                  value.push(msg.payload);
                } else {
                  value = [value];
                  value.push(msg.payload);
                }
              }
              console.log('pushed value:', value);
              localforage.setItem(STORAGE_PREFIX + node.key, value);
            });
          } else {
            console.log('INITIAL DATA');
            localforage.setItem(STORAGE_PREFIX + node.key, msg.payload, function (err, value) {
              console.log('Initial value:', value, ' with the key:', node.key);
            });
          }
        } else {
          node.send(msg);
          console.log(msg);
        } // If no payload - just pass it on.
      });
      return _this;
    }

    return LocalWriteNode;
  }(PN.Node);

  LocalWriteNode.groupName = 'localdb';
  PN.nodes.registerType("localwrite", LocalWriteNode);

  var LocalReadNode = function (_PN$Node2) {
    _inherits(LocalReadNode, _PN$Node2);

    function LocalReadNode(n) {
      _classCallCheck(this, LocalReadNode);

      var _this2 = _possibleConstructorReturn(this, (LocalReadNode.__proto__ || Object.getPrototypeOf(LocalReadNode)).call(this, n));

      var node = _this2;
      node.key = n.key;

      _this2.on("input", function (msg) {
        if (msg.hasOwnProperty("payload")) {
          localforage.getItem(STORAGE_PREFIX + node.key, function (err, value) {
            msg.payload = value;
            node.send(msg);
          });
        }
      });
      return _this2;
    }

    return LocalReadNode;
  }(PN.Node);

  LocalReadNode.groupName = 'localdb';
  PN.nodes.registerType('localread', LocalReadNode);
};