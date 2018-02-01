'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var SpeechNode = function (_PN$Node) {
    _inherits(SpeechNode, _PN$Node);

    function SpeechNode(config) {
      _classCallCheck(this, SpeechNode);

      var _this = _possibleConstructorReturn(this, (SpeechNode.__proto__ || Object.getPrototypeOf(SpeechNode)).call(this, config));

      var node = _this;
      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        var recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        if (recognition) {
          recognition.onerror = function (event) {
            if (event.error === 'no-speech') {
              console.log('No Speech Detected');
            }
          };

          recognition.onend = function () {
            if (node.isopen) {
              recognition.start();
            }
          };

          recognition.onresult = function (event) {
            var msg = {};
            msg.payload = event.results[0][0].transcript;
            console.log('speech-recognition msg', msg);
            node.send(msg);
          };

          recognition.start();
          node.isopen = true;
        }
        node.on("close", function () {
          node.isopen = false;
          recognition.stop();
        });
      } else {
        console.log('Your browser does not have the capability of voice recognition');
      }

      return _this;
    }

    return SpeechNode;
  }(PN.Node);

  PN.nodes.registerType("voice rec", SpeechNode);
};