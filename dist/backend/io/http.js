"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var urllib = require("url");
  var mustache = require("mustache");
  var querystring = require("querystring");
  var _ = require('lodash');

  var rest = require("rest");
  var errorCodeInterceptor = require('rest/interceptor/errorCode');
  var mimeInterceptor = require('rest/interceptor/mime');
  var templateInterceptor = require('rest/interceptor/template');
  var locationInterceptor = require('rest/interceptor/location');

  var HTTPRequest = function (_PN$Node) {
    _inherits(HTTPRequest, _PN$Node);

    function HTTPRequest(n) {
      _classCallCheck(this, HTTPRequest);

      var _this = _possibleConstructorReturn(this, (HTTPRequest.__proto__ || Object.getPrototypeOf(HTTPRequest)).call(this, n));

      var nodeUrl = n.url;
      var isTemplatedUrl = (nodeUrl || "").indexOf("{{") != -1;
      var nodeMethod = n.method || "GET";
      _this.ret = n.ret || "txt";
      var node = _this;

      _this.on("input", function (msg) {
        console.log('sending http request', msg);
        node.status({ fill: "blue", shape: "dot", text: "httpin.status.requesting" });
        var url = msg.url || nodeUrl;
        if (isTemplatedUrl) {
          url = mustache.render(nodeUrl, msg);
        }
        if (!url) {
          node.error(PN._("httpin.errors.no-url"), msg);
          return;
        }
        // url must start http:// or https:// so assume https:// if not set
        if (!(url.indexOf("http://") === 0 || url.indexOf("https://") === 0)) {
          url = "https://" + url;
        }

        var method = msg.method || nodeMethod.toUpperCase() || "GET";

        var opts = { method: method }; //urllib.parse(url);
        opts.headers = {};
        if (msg.headers) {
          for (var v in msg.headers) {
            if (msg.headers.hasOwnProperty(v)) {
              var name = v.toLowerCase();
              if (name !== "content-type" && name !== "content-length") {
                // only normalise the known headers used later in this
                // function. Otherwise leave them alone.
                name = v;
              }
              opts.headers[name] = msg.headers[v];
            }
          }
        }

        if (method === 'POST' || method === 'PUT') {
          opts.entity = msg.payload;
        }
        opts.params = msg.params;
        opts.path = url;

        console.log('SERVER httprequest', opts, msg);

        if (process.env.BROWSER && PN.plugin.isActive() && (_.startsWith(opts.path, 'http://') || msg.usePlugin)) {
          PN.plugin.rpc('rest', [opts], function (result) {
            var res = result.res;
            if (result.error) {
              node.status({ fill: "red", shape: "ring", text: 'error' });
              node.send(_.assign(msg, { payload: null, error: result.error }));
            } else {
              node.status({});
              node.send(_.assign(msg, { payload: res.entity, status: res.status, headers: res.headers }));
            }
          });
        } else {
          var restCall = rest.wrap(errorCodeInterceptor).wrap(templateInterceptor).wrap(locationInterceptor);
          if (_typeof(opts.entity) === 'object') {
            restCall = restCall.wrap(mimeInterceptor, { mime: 'application/json' });
          } else {
            restCall = restCall.wrap(mimeInterceptor);
          }

          restCall(opts).then(function (res) {
            console.log('http response', res);
            node.status({});
            node.send(_.assign(msg, { payload: res.entity, status: res.status, headers: res.headers }));
          }).catch(function (err) {
            node.status({ fill: "red", shape: "ring", text: 'error' });
            node.send(_.assign(msg, { payload: null, error: err }));
          });
        }
      });
      return _this;
    }

    return HTTPRequest;
  }(PN.Node);

  HTTPRequest.groupName = 'httpin';
  PN.nodes.registerType("http request", HTTPRequest);
};