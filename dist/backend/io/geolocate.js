"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function (PN) {
  var GeolocationNode = function (_PN$Node) {
    _inherits(GeolocationNode, _PN$Node);

    function GeolocationNode(config) {
      _classCallCheck(this, GeolocationNode);

      var _this = _possibleConstructorReturn(this, (GeolocationNode.__proto__ || Object.getPrototypeOf(GeolocationNode)).call(this, config));

      var node = _this;
      _this.on("input", function (msg) {
        if (msg.hasOwnProperty("payload")) {
          var error = function error(err) {
            console.log('ERROR(' + err.code + '): ' + err.message);
          };

          var success = function success(pos) {
            var crd = pos.coords;
            var accuracy = crd.accuracy,
                altitude = crd.altitude,
                altitudeAccuracy = crd.altitudeAccuracy,
                heading = crd.heading,
                latitude = crd.latitude,
                longitude = crd.longitude,
                speed = crd.speed;

            msg.location = { accuracy: accuracy, altitude: altitude, altitudeAccuracy: altitudeAccuracy, heading: heading, latitude: latitude, longitude: longitude, speed: speed };
            node.send(msg);
          };

          var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };

          ;

          navigator.geolocation.getCurrentPosition(success, error, options);
        } else {
          node.send(msg);
        } // If no payload - just pass it on.
      });
      return _this;
    }

    return GeolocationNode;
  }(PN.Node);

  PN.nodes.registerType("geolocate", GeolocationNode);
};