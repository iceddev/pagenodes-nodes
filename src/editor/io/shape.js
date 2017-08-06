module.exports = function(PN){
  PN.nodes.registerType('shape',{
    category: 'function',
    color:"rgb(174, 174, 231)",
    defaults: {
      name: {value:""},
      shapeType: {value:"face",required:true}
    },
    inputs:1,
    outputs:1,
    faChar: '&#xf029;', //qrcode
    label: function() {
      return this.name || this.shapeType;
    },
    render: function () {
      const {NameRow, SelectRow} = PN.components;
      return (
        <div>
          <SelectRow name="shapeType" label="shape type" icon="tag" options={[['face', 'face'],['QR/bar code', 'barcode'],['text', 'text']]}/>
          <NameRow/>
        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>
            Find Faces, QR codes, or text in images.  The node looks for a <code>msg.image</code> which is either an image data URL, or an ImageData object.
          </p>
          <p>
          The results are placed onto <code>msg.results</code>.
          </p>
          <p>
          This node makes use of the <a href="https://wicg.github.io/shape-detection-api" target="_blank">Accelerated Shape Detection API</a>.
          </p>
        </div>
      )
    },
    renderDescription: () => <p>Shape Detector Node</p>
  });
};
