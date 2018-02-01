"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var mustache = require("mustache");

  var TemplateNode = function (_PN$Node) {
    _inherits(TemplateNode, _PN$Node);

    function TemplateNode(n) {
      _classCallCheck(this, TemplateNode);

      var _this = _possibleConstructorReturn(this, (TemplateNode.__proto__ || Object.getPrototypeOf(TemplateNode)).call(this, n));

      _this.field = n.field || "payload";
      _this.template = n.template;
      var node = _this;

      var b = node.field.split(".");
      var i = 0;
      var m = null;
      var rec = function rec(obj) {
        i += 1;
        if (i < b.length && _typeof(obj[b[i - 1]]) === "object") {
          rec(obj[b[i - 1]]); // not there yet - carry on digging
        } else {
          if (i === b.length) {
            // we've finished so assign the value
            obj[b[i - 1]] = mustache.render(node.template, m);
            node.send(m);
          } else {
            obj[b[i - 1]] = {}; // needs to be a new object so create it
            rec(obj[b[i - 1]]); // and carry on digging
          }
        }
      };

      node.on("input", function (msg) {
        try {
          m = msg;
          i = 0;
          rec(msg);
        } catch (err) {
          node.error(err.message);
        }
      });
      return _this;
    }

    return TemplateNode;
  }(PN.Node);

  PN.nodes.registerType("template", TemplateNode);
};