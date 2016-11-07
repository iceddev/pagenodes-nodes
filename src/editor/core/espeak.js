var _ = require('lodash');

module.exports = function(PN) {
  var errorMessage = 'Your browser does not support web speech. Please use Google Chrome for this feature.'
  var voices = [];
  if(window.speechSynthesis){
    speechSynthesis.onvoiceschanged = function() {
      voices = speechSynthesis.getVoices();
    };
  }

  PN.nodes.registerType('espeak',{
    category: 'output',
    defaults: {
      name: {value: ''},
      variant: {value: ''},
      active: {value: true}
    },
    label: function() {
      return this.name || this.variant || 'espeak';
    },
    labelStyle: function() {
      return this.name ? 'node_label_italic' : '';
    },
    color:'#ffb6c1',
    inputs:1,
    outputs:0,
    faChar: '&#xf118;', //smile-o
    align: 'right',
    button: {
      toggle: 'active',
      onclick: function() {

        var label = this.name||'espeak';
        var node = this;
        PN.comms.rpc('espeak', [this.id, (this.active ? 'enable' : 'disable')], function(result) {
          if (result == 200) {
            PN.notify(node._('debug.notification.activated', {label: label}), 'success');
          } else if (result == 201) {
            PN.notify(node._('debug.notification.deactivated', {label: label}), 'success');
          }
        });
      }
    },
    oneditprepare: function() {
      var selectedVariant = this.variant;
      var dropdown = document.getElementById('node-input-variant');
      if (voices.length < 1) {
        var voiceDiv = document.getElementById('voice-selection');
        voiceDiv.style.display = 'none';
      }

      voices.forEach(function(voice){
        var newVoice = document.createElement('OPTION');
        newVoice.text = voice.name;
        newVoice.value = voice.voiceURI;
        if(voice.voiceURI === selectedVariant){
          newVoice.selected = true;
        };

        dropdown.options.add(newVoice);
      });
    },
    onpaletteadd: function() {

      this.handleEspeakMessage = function(t,o) {

        if(typeof o.msg === 'string'){
          try{
            o.msg = JSON.parse(o.msg);
          }
          catch(err){
            console.log('error parsing notification', err);
          }
        }

        var msg = o.msg;
        //do tts

        console.log('espeak', msg);
        var voice = _.find(voices, { voiceURI: o.variant });

        if(window.SpeechSynthesisUtterance && window.speechSynthesis){
          var phrase = new SpeechSynthesisUtterance(String(msg.payload));

          phrase.voice = voice;
          phrase.pitch = parseInt(msg.pitch, 10) || 1;
          phrase.speed = parseInt(msg.spped, 10) || 1;

          speechSynthesis.speak(phrase);
        } else {
          PN.notify(errorMessage, 'error');
        }
      };
      PN.comms.subscribe('espeak',this.handleEspeakMessage);

    },
    onpaletteremove: function() {
      PN.comms.unsubscribe('espeak',this.handleDebugMessage);
      // PN.sidebar.removeTab("debug");
      // delete PN._debug;
    },
    render: function () {
      const {NameRow} = PN.components;
      return (
        <div>
          <div className="form-row" id="voice-selection">
            <label htmlFor="node-input-variant">
              <i className="fa fa-circle">
              </i>
              <span data-i18n="variant">variant</span>
            </label>
            <select
              type="text"
              id="node-input-variant"
              style={{ width: "250px" }}>
            </select>
          </div>
          <NameRow/>
        </div>
      )
    },
    renderHelp: function () {
      return (
        <div>
          <p>
            The espeak node can be connected to the output of any node. It can be used to play a text-to-speech version of the <b>msg.payload</b> .
          </p>
          <p>Each message can also modify the playback <b>msg.pitch</b> and <b>msg.speed</b>.</p>
        </div>
      )
    },
    renderDescription: () => <p>TTS node for serving output to speech</p>
  });
};

