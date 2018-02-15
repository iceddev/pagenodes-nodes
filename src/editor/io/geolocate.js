module.exports = function(PN){
  PN.nodes.registerType('geolocate',{
    category: 'hardware',
    color: "lightblue",
    defaults: {
      name: {value:""},
    },
    inputs:1,
    outputs:1,
    faChar: '&#xf0ac;', //globe
    fontColor: "darkblue",
    faColor: 'darkblue',
    label: function() {
      return this.name||'geolocate';
    },
    render: function () {
      const {NameRow} = PN.components;
      return (
        <NameRow/>
      );
    },
    renderHelp: function () {
      return (
        <div>
          <p>
            This node gives the geolocation coordinates using the API from <a href="https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition">navigator.GeoLocation</a>.
          </p>
          <p>
            You can see the bulk of the location by looking at the msg.location. If you are using a debug mode, you can see this by looking at the entire msg object.
          </p>
        </div>
      )
    },
    renderDescription: () => <p>Returns the geolocation of your current device</p>
  });
};
