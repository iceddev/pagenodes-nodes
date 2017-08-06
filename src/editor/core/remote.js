module.exports = function(PN){
  PN.nodes.registerType('iot buttons',{
    category: 'input',
    color:"#a6bbcf",
    defaults: {
    },
    inputs:0,
    outputs:1,
    faChar: '&#xf00a;', //th
    // faColor: 'red',
    label: function() {
      return this.name || 'iot buttons';
    },
    render: function () {
      return (
        <div>
          <div className="form-tips">
            Simply switch to <code>IoT Remote Buttons</code> view in the PageNodes menu to send button clicks from this node.
          </div>
        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>
            When you switch to the <code>IoT Remote Buttons</code> view from the PageNodes menu, this node will send the button clicks out to other nodes you connect.
          </p>
          <p>
            A message from this node will have a <code>topic</code>, <code>type</code>, and <code>payload</code>. <br/> For example, the Number 1 button will have a <code>payload</code> of <code>1</code>.
          </p>
        </div>
      )
    },
    renderDescription: () => <p>IoT Remote Control Buttons</p>
  });

  PN.nodes.registerType('iot sliders',{
    category: 'input',
    color:"#a6bbcf",
    defaults: {
    },
    inputs:0,
    outputs:1,
    faChar: '&#xf1de;', //sliders
    // faColor: 'red',
    label: function() {
      return this.name || 'iot sliders';
    },
    render: function () {
      return (
        <div>
          <div className="form-tips">
            Simply switch to <code>IoT Remote Buttons</code> view in the PageNodes menu to send slider changes from this node.
          </div>
        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>
            When you switch to the <code>IoT Remote Buttons</code> view from the PageNodes menu, this node will send the slider changes out to other nodes you connect.
          </p>
          <p>
            A message from this node will have a <code>topic</code>, <code>type</code>, <code>slider</code>, and <code>payload</code>. <br/> For example, the Number 1 slider will have a <code>slider</code> of <code>1</code>, and its <code>payload</code> of the new value of the slider.
          </p>
        </div>
      )
    },
    renderDescription: () => <p>IoT Remote Control Buttons</p>
  });
};
