module.exports = function(PN){
  PN.nodes.registerType('camera',{
    category: 'hardware',
    color:"rgb(174, 174, 231)",
    defaults: {
      name: {value:""},
      animated: {value: false}
    },
    inputs:1,
    outputs:1,
    faChar: '&#xf083;', //camera-retro
    label: function() {
      return this.name||'camera';
    },
    labelStyle: function() {
      return this.name?"node_label_italic":"";
    },
    oneditprepare: function() {

    },
    render: function (){
      const {NameRow} = PN.components;
      return (
        <div>

          <div className="form-row" id="node-animated">
            <label htmlFor="node-input-animated">
              <i className="fa fa-video-camera" />
              <span>Animated</span>
            </label>
            <input
              type="checkbox"
              id="node-input-animated"
              style={{ display: "inlineBlock", width: "auto", "verticalAlign": "top" }}/>
            <label
              htmlFor="node-input-animated"
              style={{ width: "70%" }}> Gif
            </label>
          </div>

          <NameRow/>

        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>Attaches a base64 (dataURL) picture from your webcam to <code>msg.image</code>.</p>
        </div>
      )
    },
    renderDescription: () => <p>Uses webcam to take a picture</p>
  });
};

