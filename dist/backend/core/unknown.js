"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var UnknownNode = function (_PN$Node) {
    _inherits(UnknownNode, _PN$Node);

    function UnknownNode() {
      _classCallCheck(this, UnknownNode);

      return _possibleConstructorReturn(this, (UnknownNode.__proto__ || Object.getPrototypeOf(UnknownNode)).apply(this, arguments));
    }

    return UnknownNode;
  }(PN.Node);

  PN.nodes.registerType("unknown", UnknownNode);
};