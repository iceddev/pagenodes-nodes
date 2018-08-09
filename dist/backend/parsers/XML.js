"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
    var xml2js = require('xml2js');
    var parseString = xml2js.parseString;
    var builder = new xml2js.Builder({ renderOpts: { pretty: false } });

    var XMLNode = function (_PN$Node) {
        _inherits(XMLNode, _PN$Node);

        function XMLNode(n) {
            _classCallCheck(this, XMLNode);

            var _this = _possibleConstructorReturn(this, (XMLNode.__proto__ || Object.getPrototypeOf(XMLNode)).call(this, n));

            _this.attrkey = n.attr;
            _this.charkey = n.chr;
            var node = _this;
            _this.on("input", function (msg) {
                var value = node.getPayloadValue(msg);
                if (value) {
                    if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                        var options = {};
                        if (msg.hasOwnProperty("options") && _typeof(msg.options) === "object") {
                            options = msg.options;
                        }
                        options.async = false;
                        node.setResult(msg, builder.buildObject(msg[node.propName], options));
                        node.send(msg);
                    } else if (typeof value === "string") {
                        var options = {};
                        if (msg.hasOwnProperty("options") && _typeof(msg.options) === "object") {
                            options = msg.options;
                        }
                        options.async = true;
                        options.attrkey = node.attrkey || options.attrkey || '$';
                        options.charkey = node.charkey || options.charkey || '_';
                        parseString(value, options, function (err, result) {
                            if (err) {
                                node.error(err, msg);
                            } else {
                                node.setResult(msg, result);
                                node.send(msg);
                            }
                        });
                    } else {
                        node.warn(PN._("xml.errors.xml_js"));
                    }
                } else {
                    node.send(msg);
                } // If no payload - just pass it on.
            });
            return _this;
        }

        return XMLNode;
    }(PN.Node);

    PN.nodes.registerType("xml", XMLNode);
};