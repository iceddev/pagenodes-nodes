'use strict';

module.exports = function (PN) {

  PN.nodes.registerType('delay', {
    category: 'function', // the palette category
    color: "#E6E0F8",
    defaults: { // defines the editable properties of the node
      name: { value: "" }, //  along with default values.
      pauseType: { value: "delay", required: true },
      timeout: { value: "5", required: true, validate: PN.validators.number() },
      timeoutUnits: { value: "seconds" },
      rate: { value: "1", required: true, validate: PN.validators.number() },
      rateUnits: { value: "second" },
      randomFirst: { value: "1", required: true, validate: PN.validators.number() },
      randomLast: { value: "5", required: true, validate: PN.validators.number() },
      randomUnits: { value: "seconds" },
      drop: { value: false }
    },
    inputs: 1, // set the number of inputs - only 0 or 1
    outputs: 1, // set the number of outputs - 0 to n
    faChar: "&#xf017;", //clock-o
    label: function label() {
      // sets the default label contents
      if (this.pauseType == "delay") {
        var units = this.timeoutUnits ? this.timeoutUnits.charAt(0) : "s";
        if (this.timeoutUnits == "milliseconds") {
          units = "ms";
        }
        return this.name || this._("delay.label.delay") + " " + this.timeout + " " + units;
      } else if (this.pauseType == "rate") {
        var units = this.rateUnits ? this.rateUnits.charAt(0) : "s";
        return this.name || this._("delay.label.limit") + " " + this.rate + " msg/" + units;
      } else if (this.pauseType == "random") {
        return this.name || this._("delay.label.random");
      } else {
        var units = this.rateUnits ? this.rateUnits.charAt(0) : "s";
        return this.name || this._("delay.label.queue") + " " + this.rate + " msg/" + units;
      }
    },
    labelStyle: function labelStyle() {
      // sets the class to apply to the label
      return this.name ? "node_label_italic" : "";
    },
    oneditprepare: function oneditprepare() {
      $("#node-input-timeout").spinner({ min: 1 });
      $("#node-input-rate").spinner({ min: 1 });

      $("#node-input-randomFirst").spinner({ min: 0 });
      $("#node-input-randomLast").spinner({ min: 1 });

      if (this.pauseType == "delay") {
        $("#delay-details").show();
        $("#rate-details").hide();
        $("#random-details").hide();
        $("#node-input-dr").hide();
      } else if (this.pauseType == "rate") {
        $("#delay-details").hide();
        $("#rate-details").show();
        $("#random-details").hide();
        $("#node-input-dr").show();
      } else if (this.pauseType == "random") {
        $("#delay-details").hide();
        $("#rate-details").hide();
        $("#random-details").show();
        $("#node-input-dr").hide();
      } else if (this.pauseType == "queue") {
        $("#delay-details").hide();
        $("#rate-details").show();
        $("#random-details").hide();
        $("#node-input-dr").hide();
      }

      if (!this.timeoutUnits) {
        $("#node-input-timeoutUnits option").filter(function () {
          return $(this).val() == 'seconds';
        }).attr('selected', true);
      }

      if (!this.randomUnits) {
        $("#node-input-randomUnits option").filter(function () {
          return $(this).val() == 'seconds';
        }).attr('selected', true);
      }

      $("#node-input-pauseType").on("change", function () {
        if (this.value == "delay") {
          $("#delay-details").show();
          $("#rate-details").hide();
          $("#random-details").hide();
          $("#node-input-dr").hide();
        } else if (this.value == "rate") {
          $("#delay-details").hide();
          $("#rate-details").show();
          $("#random-details").hide();
          $("#node-input-dr").show();
        } else if (this.value == "random") {
          $("#delay-details").hide();
          $("#rate-details").hide();
          $("#random-details").show();
          $("#node-input-dr").hide();
        } else if (this.value == "queue") {
          $("#delay-details").hide();
          $("#rate-details").show();
          $("#random-details").hide();
          $("#node-input-dr").hide();
        }
      });
    },
    render: function render() {
      var NameRow = PN.components.NameRow;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-pauseType' },
            React.createElement('i', { className: 'fa fa-tasks' }),
            ' ',
            React.createElement(
              'span',
              null,
              'Action'
            )
          ),
          React.createElement(
            'select',
            { id: 'node-input-pauseType', style: { width: '270px !important' } },
            React.createElement(
              'option',
              { value: 'delay' },
              'delay'
            ),
            React.createElement(
              'option',
              { value: 'random' },
              'random'
            ),
            React.createElement(
              'option',
              { value: 'rate' },
              'rate'
            ),
            React.createElement(
              'option',
              { value: 'queue' },
              'queue'
            )
          )
        ),
        React.createElement(
          'div',
          { id: 'delay-details', className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-timeout' },
            React.createElement('i', { className: 'fa fa-clock-o' }),
            ' ',
            React.createElement(
              'span',
              null,
              'For'
            )
          ),
          React.createElement('input', { type: 'text', id: 'node-input-timeout', placeholder: 'Time', style: { width: '50px !important' } }),
          React.createElement(
            'select',
            { id: 'node-input-timeoutUnits', style: { width: '200px !important' } },
            React.createElement(
              'option',
              { value: 'milliseconds' },
              'milliseconds'
            ),
            React.createElement(
              'option',
              { value: 'seconds' },
              'seconds'
            ),
            React.createElement(
              'option',
              { value: 'minutes' },
              'minutes'
            ),
            React.createElement(
              'option',
              { value: 'hours' },
              'hours'
            ),
            React.createElement(
              'option',
              { value: 'days' },
              'days'
            )
          )
        ),
        React.createElement(
          'div',
          { id: 'rate-details', className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-rate' },
            React.createElement('i', { className: 'fa fa-clock-o' }),
            ' ',
            React.createElement(
              'span',
              null,
              'Rate'
            )
          ),
          React.createElement('input', { type: 'text', id: 'node-input-rate', placeholder: '1', style: { width: '30px !important' } }),
          React.createElement(
            'label',
            { htmlFor: 'node-input-rateUnits' },
            React.createElement(
              'span',
              null,
              'msg(s) per'
            )
          ),
          React.createElement(
            'select',
            { id: 'node-input-rateUnits', style: { width: '140px !important' } },
            React.createElement(
              'option',
              { value: 'second' },
              'second'
            ),
            React.createElement(
              'option',
              { value: 'minute' },
              'minute'
            ),
            React.createElement(
              'option',
              { value: 'hour' },
              'hour'
            ),
            React.createElement(
              'option',
              { value: 'day' },
              'day'
            )
          ),
          React.createElement('br', null),
          React.createElement(
            'div',
            { id: 'node-input-dr' },
            React.createElement('input', { style: { margin: '20px 0 20px 100px', width: '30px' }, type: 'checkbox', id: 'node-input-drop' }),
            React.createElement(
              'label',
              { style: { width: '250px' }, htmlFor: 'node-input-drop' },
              React.createElement(
                'span',
                null,
                'drop intermediate messages'
              )
            )
          )
        ),
        React.createElement(
          'div',
          { id: 'random-details', className: 'form-row' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-randomFirst' },
            React.createElement('i', { className: 'fa fa-clock-o' }),
            ' ',
            React.createElement(
              'span',
              null,
              'between'
            )
          ),
          React.createElement('input', { type: 'text', id: 'node-input-randomFirst', placeholder: '', style: { width: '30px !important' } }),
          React.createElement(
            'label',
            { htmlFor: 'node-input-randomLast', style: { width: '20px' } },
            ' & '
          ),
          React.createElement('input', { type: 'text', id: 'node-input-randomLast', placeholder: '', style: { width: '30px !important' } }),
          React.createElement(
            'select',
            { id: 'node-input-randomUnits', style: { width: '140px !important' } },
            React.createElement('option', { value: 'milliseconds' }),
            React.createElement('option', { value: 'seconds' }),
            React.createElement('option', { value: 'minutes' }),
            React.createElement('option', { value: 'hours' }),
            React.createElement('option', { value: 'days' })
          )
        ),
        React.createElement(NameRow, null)
      );
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'Introduces a delay into a flow or rate limits messages.'
        ),
        React.createElement(
          'p',
          null,
          'Default delay is 5 seconds and rate limit of 1 msg/second, but both can be configured.'
        ),
        React.createElement(
          'p',
          null,
          'If you select a rate limit you may optionally discard any intermediate messages that arrive.'
        ),
        React.createElement(
          'p',
          null,
          'The "topic based fair queue" adds messages to a release queue tagged by their ',
          React.createElement(
            'code',
            null,
            'msg.topic'
          ),
          ' property. At each "tick", derived from the rate, the next "topic" is released. Any messages arriving on the same topic before release replace those in that position in the queue. So each "topic" gets a turn - but the most recent value is always the one sent.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Introduces a delay into a flow or rate limits messages.'
      );
    }
  });
};