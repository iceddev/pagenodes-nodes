module.exports = function(PN) {
  const {NameRow, TextRow} = PN.components;

  PN.nodes.registerType('localwrite', {
    category: 'storage',
    color: "#7E57C2",
    defaults: {
      name: {
        value: ""
      },
      append: {
        value: '',
      },
      key: {
        value: "",
        required:true
      }
    },
    inputs: 1,
    outputs: 0,
    //icon: "leveldb.png",
    faChar: '&#xf1c0;', //database
    fontColor: "#FFF",
    label: function() {
      return this.name || "localwrite";
    },
    labelStyle: function() {
      return this.name ? "node_label_italic" : "";
    },
    render: function () {
      return (
        <div>
          <TextRow name="key" icon="tag"/>
          <div className="form-row">
            <label>&nbsp;</label>
            <input
              type="checkbox"
              id="node-input-append"
              style={{display: 'inline-block', width: 'auto', verticalAlign: 'top'}} />
            <label
              htmlFor="node-input-append"
              style={{width: '70%'}}
              data-i18n="common.label.append" />
          </div>
          <NameRow/>
        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>Writes to local storage utilizing localforage.</p>
          <p><a href="https://mozilla.github.io/localForage">https://mozilla.github.io/localForage</a></p>
        </div>
      )
    },
    renderDescription: function () {
      return (
        <p>Writes data to local storage</p>
      )
    }
  });


  PN.nodes.registerType('localread', {
    category: 'storage',
    color: "#7E57C2",
    defaults: {
      name: {
        value: ""
      },
      key: {
        value: "",
        required:true
      }
    },
    inputs: 1,
    outputs: 1,
    faChar: '&#xf1c0;', //database
    fontColor: "#FFF",
    label: function() {
      return this.name || "localread";
    },
    labelStyle: function() {
      return this.name ? "node_label_italic" : "";
    },
    render: function () {
      return (
        <div>
          <TextRow name="key" icon="tag"/>
          <NameRow/>
        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>
            Retrieves a payload based off of its key with localforage.  Output will be sent to console.log as well.
          </p>
          <p>
            <a href="https://mozilla.github.io/localForage">https://mozilla.github.io/localForage</a>
          </p>
        </div>
      )
    },
    renderDescription: () => <p>Reads data in localStorage</p>
  });
}

