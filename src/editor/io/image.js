module.exports = function(PN){
  PN.nodes.registerType('image',{
    category: 'function',
    color:"rgb(174, 174, 231)",
    defaults: {
      name: {value:""},
      operation: {value:"resize",required:true}
    },
    inputs:1,
    outputs:1,
    faChar: '&#xf03e;', //photo
    label: function() {
      return this.name || this.operation;
    },
    render: function () {
      const {NameRow, SelectRow} = PN.components;
      return (
        <div>
          <SelectRow name="operation" label="operation" icon="tag" options={[['resize', 'resize'],['crop', 'crop'],['Get Image Data', 'getImageData'], ['To Data URL', 'dataToUrl'] ]}/>
          <NameRow/>
        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>
            Uses HTML Canvas to perform various image operations.
          </p>
        </div>
      )
    },
    renderDescription: () => <p>Image Operations Node</p>
  });
};
