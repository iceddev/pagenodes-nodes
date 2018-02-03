module.exports = function(PN){
  PN.nodes.registerType('unknown',{
    category: 'unknown',
    color:"#fff0f0",
    defaults: {
      name: {value:""}
    },
    inputs:1,
    outputs:1,
    icon: "",
    label: function() {
      return "("+this.name+")"||this._("unknown.label.unknown");
    },
    labelStyle: function() {
      return "node_label_unknown";
    },
    render: () => {
      return (
        <div>
          <div className="form-tips">
            This node is a type unknown to your Chirpers runtime.  You may wish to remove this node from your flow, or try running this flow on a different runtime.
          </div>
        </div>
      )
    },
    renderHelp: () => {
      return (
        <div>
          <p>
            This node is a type unknown to your Chirpers runtime.
          </p>
        </div>
      )
    },
    renderDescription: () => <div class="form-tips">unknown</div>
  });
};
