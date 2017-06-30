"use strict";

module.exports = function (PN) {

  "use strict";

  function GeolocationNode(config) {
    PN.nodes.createNode(this, config);
    var node = this;
    this.on("input", function (msg) {
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
  }
  PN.nodes.registerType("geolocate", GeolocationNode);
};