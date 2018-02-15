"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  "use strict";

  var InjectNode = function (_PN$Node) {
    _inherits(InjectNode, _PN$Node);

    function InjectNode(n) {
      _classCallCheck(this, InjectNode);

      var _this = _possibleConstructorReturn(this, (InjectNode.__proto__ || Object.getPrototypeOf(InjectNode)).call(this, n));

      _this.topic = n.topic;
      _this.payload = n.payload;
      _this.payloadType = n.payloadType;
      _this.repeat = n.repeat;
      _this.crontab = n.crontab;
      _this.once = n.once;
      var node = _this;
      _this.type = 'inject';
      _this.interval_id = null;
      _this.cronjob = null;
      _this.allowDebugInput = n.allowDebugInput;

      if (_this.repeat && !isNaN(_this.repeat) && _this.repeat > 0) {
        _this.repeat = _this.repeat * 1000;
        if (PN.settings.verbose) {
          _this.log(PN._("inject.repeat", _this));
        }
        _this.interval_id = setInterval(function () {
          node.emit("emitMsg", {});
        }, _this.repeat);
      } else if (_this.crontab) {
        if (PN.settings.verbose) {
          _this.log(PN._("inject.crontab", _this));
        }
      }

      if (_this.once) {
        setTimeout(function () {
          node.emit("emitMsg", {});
        }, 100);
      }

      _this.on('emitMsg', function () {
        var msg = { topic: _this.topic };
        if (!_this.payloadType && !_this.payload || _this.payloadType === "date") {
          msg.payload = Date.now();
        } else if (!_this.payloadType) {
          msg.payload = _this.payload;
        } else {
          msg.payload = _this.getInputValue('payload', msg);
        }
        _this.send(msg);
        msg = null;
      });
      return _this;
    }

    _createClass(InjectNode, [{
      key: "close",
      value: function close() {
        if (this.interval_id != null) {
          clearInterval(this.interval_id);
          if (PN.settings.verbose) {
            this.log(PN._("inject.stopped"));
          }
        } else if (this.cronjob != null) {
          this.cronjob.stop();
          if (PN.settings.verbose) {
            this.log(PN._("inject.stopped"));
          }
          delete this.cronjob;
        }
      }
    }]);

    return InjectNode;
  }(PN.Node);

  PN.nodes.registerType("inject", InjectNode);

  PN.events.on("rpc_inject", function (data) {
    var node = PN.nodes.getNode(data.params[0]);
    if (node != null) {
      if (data.params[1]) {
        node.send({
          topic: node.topic,
          payload: data.params[1]
        });
      } else {
        node.emit('emitMsg');
      }
      data.reply('ok');
    } else {
      data.reply('not ok');
    }
  });

  PN.events.on("rpc_inject_text", function (data) {
    PN.nodes.eachNode(function (n) {
      // console.log('each node', n);
      if (n.type === 'inject' && n.allowDebugInput) {
        n.send({
          topic: n.topic,
          payload: data.params[0]
        });
      }
    });
    data.reply('ok');
  });
};