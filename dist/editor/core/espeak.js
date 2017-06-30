'use strict';

var _ = require('lodash');

module.exports = function (PN) {
  var errorMessage = 'Your browser does not support web speech. Please use Google Chrome for this feature.';
  var voices = [];
  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = function () {
      voices = speechSynthesis.getVoices();
    };
  }

  PN.nodes.registerType('espeak', {
    category: 'output',
    defaults: {
      name: { value: '' },
      variant: { value: '' },
      active: { value: true }
    },
    label: function label() {
      return this.name || this.variant || 'espeak';
    },
    labelStyle: function labelStyle() {
      return this.name ? 'node_label_italic' : '';
    },
    color: '#ffb6c1',
    inputs: 1,
    outputs: 0,
    faChar: '&#xf118;', //smile-o
    align: 'right',
    button: {
      toggle: 'active',
      onclick: function onclick() {

        var label = this.name || 'espeak';
        var node = this;
        PN.comms.rpc('espeak', [this.id, this.active ? 'enable' : 'disable'], function (result) {
          if (result == 200) {
            PN.notify(node._('debug.notification.activated', { label: label }), 'success');
          } else if (result == 201) {
            PN.notify(node._('debug.notification.deactivated', { label: label }), 'success');
          }
        });
      }
    },
    oneditprepare: function oneditprepare() {
      var selectedVariant = this.variant;
      var dropdown = document.getElementById('node-input-variant');
      if (voices.length < 1) {
        var voiceDiv = document.getElementById('voice-selection');
        voiceDiv.style.display = 'none';
      }

      voices.forEach(function (voice) {
        var newVoice = document.createElement('OPTION');
        newVoice.text = voice.name;
        newVoice.value = voice.voiceURI;
        if (voice.voiceURI === selectedVariant) {
          newVoice.selected = true;
        };

        dropdown.options.add(newVoice);
      });
    },
    onpaletteadd: function onpaletteadd() {

      this.handleEspeakMessage = function (t, o) {

        if (typeof o.msg === 'string') {
          try {
            o.msg = JSON.parse(o.msg);
          } catch (err) {
            console.log('error parsing notification', err);
          }
        }

        var msg = o.msg;
        //do tts

        console.log('espeak', msg);
        var voice = _.find(voices, { voiceURI: o.variant });

        if (window.SpeechSynthesisUtterance && window.speechSynthesis) {
          var phrase = new SpeechSynthesisUtterance(String(msg.payload));

          phrase.voice = voice;
          phrase.pitch = parseInt(msg.pitch, 10) || 1;
          phrase.speed = parseInt(msg.spped, 10) || 1;

          speechSynthesis.speak(phrase);
        } else {
          PN.notify(errorMessage, 'error');
        }
      };
      PN.comms.subscribe('espeak', this.handleEspeakMessage);
    },
    onpaletteremove: function onpaletteremove() {
      PN.comms.unsubscribe('espeak', this.handleDebugMessage);
      // PN.sidebar.removeTab("debug");
      // delete PN._debug;
    },
    render: function render() {
      var NameRow = PN.components.NameRow;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'form-row', id: 'voice-selection' },
          React.createElement(
            'label',
            { htmlFor: 'node-input-variant' },
            React.createElement('i', { className: 'fa fa-circle' }),
            React.createElement(
              'span',
              { 'data-i18n': 'variant' },
              'variant'
            )
          ),
          React.createElement('select', {
            type: 'text',
            id: 'node-input-variant',
            style: { width: "250px" } })
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
          'The espeak node can be connected to the output of any node. It can be used to play a text-to-speech version of the ',
          React.createElement(
            'b',
            null,
            'msg.payload'
          ),
          ' .'
        ),
        React.createElement(
          'p',
          null,
          'Each message can also modify the playback ',
          React.createElement(
            'b',
            null,
            'msg.pitch'
          ),
          ' and ',
          React.createElement(
            'b',
            null,
            'msg.speed'
          ),
          '.'
        )
      );
    },
    renderDescription: function renderDescription() {
      return React.createElement(
        'p',
        null,
        'TTS node for serving output to speech'
      );
    }
  });
};