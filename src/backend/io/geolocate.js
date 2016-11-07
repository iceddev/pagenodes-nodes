module.exports = function(PN) {

  "use strict";

  function GeolocationNode(config) {
    PN.nodes.createNode(this,config);
    var node = this;
    this.on("input", function(msg) {
      if (msg.hasOwnProperty("payload")) {

        var options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        function error(err) {
          console.log('ERROR(' + err.code + '): ' + err.message);
        };

        function success(pos) {
          var crd = pos.coords;
          const { accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed } = crd;
          msg.location = { accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed };
          node.send(msg);
        }
        navigator.geolocation.getCurrentPosition(success, error, options);
      }
      else { node.send(msg); } // If no payload - just pass it on.
    });
  }
  PN.nodes.registerType("geolocate",GeolocationNode);
};

