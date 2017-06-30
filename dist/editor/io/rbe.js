'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('rbe', {
    category: 'function',
    color: "#E2D96E",
    defaults: {
      name: { value: "" },
      func: { value: "rbe" },
      gap: { value: "", validate: PN.validators.regex(/^(\d*[.]*\d*|)(%|)$/) },
      start: { value: "" },
      inout: { value: "out" }
    },
    inputs: 1,
    outputs: 1,
    faChar: "&#xf071;",
    label: function label() {
      return this.name || "rbe";
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },
    oneditprepare: function oneditprepare() {
      //$( "#node-input-gap" ).spinner({min:0});
      if ($("#node-input-inout").val() === null) {
        $("#node-input-inout").val("out");
      }
      $("#node-input-func").on("change", function () {
        if ($("#node-input-func").val() === "rbe") {
          $("#node-bandgap").hide();
        } else {
          $("#node-bandgap").show();
        }
        if ($("#node-input-func").val() === "narrowband") {
          $("#node-startvalue").show();
        } else {
          $("#node-startvalue").hide();
        }
      });
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-func' },
            React.createElement('i', { className: 'fa fa-wrench' }),
            ' ',
            React.createElement(
              'span',
              null,
              'Mode'
            )
          ),
          React.createElement(
            'select',
            { type: 'text', id: 'node-input-func', style: { width: "74%" } },
            React.createElement(
              'option',
              { value: 'rbe' },
              'block unless value changes'
            ),
            React.createElement(
              'option',
              { value: 'deadband' },
              'block unless value changes by more than'
            ),
            React.createElement(
              'option',
              { value: 'narrowband' },
              'block if value changes by more than'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'form-row', id: 'node-bandgap' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-gap' },
            '\xA0'
          ),
          React.createElement('input', { type: 'text', id: 'node-input-gap', placeholder: 'e.g. 10 or 5%', style: { width: "80px" } }),
          React.createElement(
            'select',
            { type: 'text', id: 'node-input-inout', style: { width: "50%", marginLeft: "3%" } },
            React.createElement(
              'option',
              { value: 'out' },
              'compared to last valid output value'
            ),
            React.createElement(
              'option',
              { value: 'in' },
              'compared to last valid input value'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'form-row', id: 'node-startvalue' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-start' },
            React.createElement('i', { className: 'fa fa-thumb-tack' }),
            React.createElement(
              'span',
              { style: { marginLeft: "5%" } },
              'Start value'
            )
          ),
          React.createElement('input', { type: 'text', id: 'node-input-start', placeholder: 'leave blank to use first data received', style: { width: "71%" } })
        ),
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-name' },
            React.createElement('i', { className: 'fa fa-tag' }),
            ' ',
            React.createElement(
              'span',
              null,
              'Name'
            )
          ),
          React.createElement('input', { type: 'text', id: 'node-input-name', placeholder: 'name', style: { width: "71%" } })
        )
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'Report by Exception node - only passes on data if it has changed.'
        ),
        React.createElement(
          'p',
          null,
          'The node can either block until the ',
          React.createElement(
            'code',
            null,
            'msg.payload'
          ),
          ' is different to the previous one - ',
          React.createElement(
            'b',
            null,
            'rbe'
          ),
          ' mode. This works on numbers, strings, and simple objects.'
        ),
        React.createElement(
          'p',
          null,
          'Or it can block until the value changes by a specified amount - ',
          React.createElement(
            'b',
            null,
            'deadband'
          ),
          ' mode.'
        ),
        React.createElement(
          'p',
          null,
          'In deadband mode the incoming payload must contain a parseable ',
          React.createElement(
            'i',
            null,
            'number'
          ),
          ' and is output only if greater than + or - the ',
          React.createElement(
            'i',
            null,
            'band gap'
          ),
          ' away from a previous value.'
        ),
        React.createElement(
          'p',
          null,
          'Deadband also supports % - only sends if the input differs by more than x% of the original value.'
        ),
        React.createElement(
          'p',
          null,
          'It can also ignore outlier values - ',
          React.createElement(
            'b',
            null,
            'narrowband'
          ),
          ' mode.'
        ),
        React.createElement(
          'p',
          null,
          'In narrowband mode the incoming payload is blocked if it is more than + or - the band gap away from the previous value. Useful for ignoring outliers from a faulty sensor for example.'
        ),
        React.createElement(
          'p',
          null,
          'Both Deadband and Narrowband allow comparison against either the ',
          React.createElement(
            'i',
            null,
            'previous valid output value'
          ),
          ', thus ignoring any values out of range; or the ',
          React.createElement(
            'i',
            null,
            'previous input value'
          ),
          ', which resets the set point, thus allowing gradual drift (deadband), or a step change (narrowband).'
        ),
        React.createElement(
          'p',
          null,
          React.createElement(
            'b',
            null,
            'Note:'
          ),
          ' This works on a per ',
          React.createElement(
            'code',
            null,
            'msg.topic'
          ),
          ' basis. This means that a single rbe node can handle multiple topics at the same time.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Report by Exception node - only passes on data if it has changed'
      );
    }

  });
};