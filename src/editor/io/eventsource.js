module.exports = function(PN) {

  const {NameRow, TextRow} = PN.components;

  (function () {

    function sse_label() {
      return this.name || "[sse] " + (this.topic || "eventsource");
    }


    PN.nodes.registerType('eventsource', {
      category: 'input',
      defaults: {
        name: {
          value: ""
        },
        topic: {
          value: "",
          required: false
        },
        client: {
          type: "eventsource-client",
          required: true
        }
      },
      color: "rgb(255, 215, 180)",
      inputs: 0,
      outputs: 1,
      //icon: "white-globe.png",
      faChar: '&#xf0ac;', //globe
      labelStyle: function () {
        return this.name ? "node_label_italic" : "";
      },
      label: sse_label,
      render: function () {
        return (
          <div>
            <TextRow name="client" icon="bookmark" />
            <TextRow name="topic" icon="tag" />
            <NameRow/>
          </div>
        )
      },
      renderHelp: function () {
        return (
          <div>
            <p>
              EventSource (Server Sent Events) input node.
            </p>
            <p>
              The event data will be in <b>msg.payload</b>.
              If no topic is specified, the node will listen for unnamed messages.
            </p>
          </div>
        )
      },
      renderDescription: function () {
        return(
          <p>
            EventSource Input Node
          </p>
        )
      }
    });


    PN.nodes.registerType('eventsource-client', {
      category: 'config',
      defaults: {
        path: {
          value: "",
          required: true
        }
      },
      inputs: 0,
      outputs: 0,
      label: function () {
        if (this.path && this.path.length > 35) {
          return this.path.substring(0, 33) + '...';
        }
        return this.path;
      },
      render: function () {
        return (
          <div>

            <TextRow name="path" icon="bookmark" placeholder="https://example.com/sse" config={true} />

            <div className="form-tips">
              <p>
                <span>
                  This will need to a be a CORS compliant HTTPS URL.
                </span>
              </p>
            </div>

          </div>
        )
      },
      renderHelp: function () {
        return (
          <div>
            <p>This configuration node connects an EventSource (Server Sent Events) client to the specified URL.</p>
          </div>
        )
      },
      renderDescription: () => <p>EventSource Output Node</p>
    });
  })();
}
