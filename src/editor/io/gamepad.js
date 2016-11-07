module.exports = function(PN){
  PN.nodes.registerType('gamepad',{
    category: 'hardware',
    color: "#26C6DA",
    defaults: {
      name: {value:""},
      controllerId: {value:"0",required:true},
      refreshInterval: {value: "300", required: false}
    },
    inputs:0,
    outputs:1,
    faChar: '&#xf11b;', //gamepad
    label: function() {
      return this.name||'gamepad';
    },
    labelStyle: function() {
      return this.name?"node_label_italic":"";
    },
    render: function () {
      const {NameRow, TextRow, SelectRow} = PN.components;
      return (
        <div>

          <TextRow name="refreshInterval" label="Interval (ms)" icon="clock-o" placeholder="300" />

          <SelectRow name="controllerId" label="controller" icon="tag" options={[[1, 0],[2, 1],[3, 2],[4, 3]]}/>

          <NameRow/>

          <div className="form-tips" id="tip-json" hidden>
            <span data-i18n="httpin.tip.req" />
          </div>

        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>
            This node was built for utilizing USB gamepads.  The primary package is still going to be <code>msg.payload</code>.  The easiest way to return is to create a function node and use an if statement to check if a button is set to "pressed".
          </p>
          <p>
            The library <code>navigator.gamepad</code> is located <a href="https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/buttons">here</a>.
          </p>
        </div>
      )
    },
    renderDescription: () => <p>Gamepad Node</p>
  });
};
