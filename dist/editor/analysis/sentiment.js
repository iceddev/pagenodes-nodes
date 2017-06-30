'use strict';

module.exports = function (PN) {
  PN.nodes.registerType('sentiment', {
    category: 'analysis-function',
    color: "#E6E0F8",
    defaults: {
      name: { value: "" }
    },
    inputs: 1,
    outputs: 1,
    faChar: "&#xf11a;", //meh-o
    label: function label() {
      return this.name || "sentiment";
    },
    labelStyle: function labelStyle() {
      return this.name ? "node_label_italic" : "";
    },
    render: function render() {
      var NameRow = PN.components.NameRow;

      return React.createElement(NameRow, null);
    },
    renderHelp: function renderHelp() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'Analyses the ',
          React.createElement(
            'b',
            null,
            'msg.payload'
          ),
          ' and adds a ',
          React.createElement(
            'b',
            null,
            'msg.sentiment'
          ),
          ' object that contains the resulting AFINN-111 sentiment score as ',
          React.createElement(
            'b',
            null,
            'msg.sentiment.score'
          ),
          '.'
        ),
        React.createElement(
          'p',
          null,
          'A score greater than zero is positive and less than zero is negative.'
        ),
        React.createElement(
          'p',
          null,
          'The score typically ranges from -5 to +5, but can go higher and lower.'
        ),
        React.createElement(
          'p',
          null,
          'An object of word score overrides can be supplied as ',
          React.createElement(
            'b',
            null,
            'msg.overrides'
          ),
          '.'
        ),
        React.createElement(
          'p',
          null,
          'See ',
          React.createElement(
            'a',
            { href: 'https://github.com/thisandagain/sentiment/blob/master/README.md', target: '_new' },
            'the Sentiment docs here'
          ),
          '.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'Returns a numerical value based off of sentiment analysis'
      );
    }
  });
};