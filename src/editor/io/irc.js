'use strict';

module.exports = function (RED) {
    var _RED$components = RED.components,
        NameRow = _RED$components.NameRow,
        TextRow = _RED$components.TextRow,
        SelectRow = _RED$components.SelectRow;


    RED.nodes.registerType('irc in', {
        category: 'social-input',
        defaults: {
            name: { value: "" },
            ircserver: { type: "irc-server", required: true },
            channel: { value: "", required: true, validate: RED.validators.regex(/^#/) }
        },
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        },
        color: "Silver",
        inputs: 0,
        outputs: 2,
        faChar: "#",
        label: function label() {
            var ircNode = RED.nodes.node(this.ircserver);
            return this.name || (ircNode ? ircNode.label() : "irc");
        },
        labelStyle: function labelStyle() {
            return this.name ? "node_label_italic" : "";
        },
        oneditprepare: function oneditprepare() {
            if (this.ircserver !== undefined && this.ircserver !== "") {
                this.channel = this.channel || RED.nodes.node(this.ircserver).channel;
                $("#node-input-channel").val(this.channel);
            } else {
                this.channel = this.channel;
            }
            $("#node-input-channel").val(this.channel);
        },
        render: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(TextRow, { name: 'ircserver', icon: 'globe' }),
                React.createElement(TextRow, { name: 'channel', icon: 'random', placeholder: '#chirpers' }),
                React.createElement(NameRow, null),
                React.createElement(
                    'div',
                    { className: 'form-tips' },
                    React.createElement(
                        'span',
                        null,
                        'The channel to join must start with a # You may join multiple channels by comma separating a list - #chan1,#chan2,etc.'
                    )
                )
            );
        },
        renderHelp: function renderHelp() {
            return React.createElement(
                'div',
                null,
                'Connects to a channel on an IRC server.'
            );
        },
        renderDescription: function renderDescription() {
            return React.createElement(
                'p',
                null,
                'IRC input node.'
            );
        }
    });

    RED.nodes.registerType('irc out', {
        category: 'social-output',
        defaults: {
            name: { value: "" },
            sendObject: { value: "pay", required: true },
            ircserver: { type: "irc-server", required: true },
            channel: { value: "", required: true, validate: RED.validators.regex(/^#/) }
        },
        color: "Silver",
        inputs: 1,
        outputs: 0,
        faChar: "#",
        align: "right",
        label: function label() {
            return this.name || (this.ircserver ? RED.nodes.node(this.ircserver).label() : "irc");
        },
        labelStyle: function labelStyle() {
            return this.name ? "node_label_italic" : "";
        },
        oneditprepare: function oneditprepare() {
            if (this.ircserver !== undefined && this.ircserver !== "") {
                this.channel = this.channel || RED.nodes.node(this.ircserver).channel;
                $("#node-input-channel").val(this.channel);
            } else {
                this.channel = this.channel;
            }
        },
        render: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(TextRow, { name: 'ircserver', icon: 'globe' }),
                React.createElement(TextRow, { name: 'channel', icon: 'random', placeholder: '#pagenodes' }),
                React.createElement(SelectRow, { name: 'sendObject', icon: 'arrows', options: [['send payload to channel(s)', 'pay'], ['Use msg.topic to set nickname or channel(s)', 'true'], ['Send complete msg object to channel(s)', 'false']] }),
                React.createElement(NameRow, null),
                React.createElement(
                    'div',
                    { className: 'form-tips' },
                    React.createElement(
                        'span',
                        null,
                        'The channel to join must start with a # Sending the complete object will stringify the whole msg object before sending.'
                    )
                )
            );
        },
        renderHelp: function renderHelp() {
            return React.createElement(
                'div',
                null,
                'Sends messages to a channel on an IRC server'
            );
        },
        renderDescription: function renderDescription() {
            return React.createElement(
                'p',
                null,
                'IRC output node.'
            );
        }
    });

    RED.nodes.registerType('irc-server', {
        category: 'config',
        defaults: {
            server: { value: "", required: true },
            port: { value: "6667" },
            ssl: { value: false },
            cert: { value: false },
            nickname: { value: "", required: true }
        },
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        },
        label: function label() {
            return this.server;
        },
        oneditprepare: function oneditprepare() {
            $("#node-config-input-ssl").change(function () {
                if ($("#node-config-input-ssl").is(":checked")) {
                    $("#certrow").show();
                } else {
                    $("#certrow").hide();
                }
            });
        },
        oneditsave: function oneditsave() {
            this.ssl = $("#node-config-input-ssl").is(":checked");
            this.cert = $("#node-config-input-cert").is(":checked");
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
                        { htmlFor: 'node-config-input-server' },
                        React.createElement('i', { className: 'fa fa-globe' }),
                        ' ',
                        React.createElement('span', { 'data-i18n': 'irc.label.ircserver' })
                    ),
                    React.createElement('input', { type: 'text', id: 'node-config-input-server', placeholder: 'irc.freenode.net', style: { width: '45%' } }),
                    React.createElement(
                        'label',
                        { htmlFor: 'node-config-input-port', style: { marginLeft: '10px', width: '35px' } },
                        ' ',
                        React.createElement('span', { 'data-i18n': 'irc.label.port' })
                    ),
                    React.createElement('input', { type: 'text', id: 'node-config-input-port', style: { width: '45px' } })
                ),
                React.createElement(
                    'div',
                    { className: 'form-row' },
                    React.createElement(
                        'label',
                        null,
                        '\xA0'
                    ),
                    React.createElement('input', { type: 'checkbox', id: 'node-config-input-ssl', style: { display: 'inline-block', width: 'auto', verticalAlign: 'top' } }),
                    React.createElement(
                        'label',
                        { htmlFor: 'node-config-input-ssl', style: { width: '70%' } },
                        React.createElement(
                            'span',
                            null,
                            'Use Secure SSL connection?'
                        )
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'form-row', id: 'certrow' },
                    React.createElement(
                        'label',
                        null,
                        '\xA0'
                    ),
                    React.createElement('input', { type: 'checkbox', id: 'node-config-input-cert', style: { display: 'inline-block', width: 'auto', verticalAlign: 'top' } }),
                    React.createElement(
                        'label',
                        { htmlFor: 'node-config-input-cert', style: { width: '70%' } },
                        React.createElement(
                            'span',
                            null,
                            'Allow self-signed certificates?'
                        )
                    )
                ),
                React.createElement(TextRow, { name: 'nickname', icon: 'heart', config: true }),
                React.createElement(TextRow, { name: 'username', icon: 'user', config: true }),
                React.createElement(TextRow, { name: 'password', icon: 'lock', config: true })
            );
        },
        renderHelp: function renderHelp() {
            return React.createElement(
                'div',
                null,
                'IRC server config'
            );
        },
        renderDescription: function renderDescription() {
            return React.createElement(
                'p',
                null,
                'IRC server connection.'
            );
        }
    });
};

/*
<script type="text/x-red" data-help-name="irc in">
    <p>Connects to a channel on an IRC server.</p>
    <p>You may join multiple channels by comma separating a list - #chan1,#chan2,#etc.</p>
    <p>Any messages on that channel will appear on the <code>msg.payload</code> at the output,
    while <code>msg.topic</code> will contain who it is from.
    <code>msg.to</code> contains either the name of the channel or PRIV in the case of a pm.</p>
    <p>The second output provides a <code>msg.payload</code> that has any status messages such as joins, parts, kicks etc.</p>
    <p>The type of the status message is set as <code>msg.payload.type</code>.</p>
    <p>The possible status types are: <br />
    <table border="1" cellpadding="1" cellspacing="1">
    <thead>
        <tr>
            <th scope="col">Type</th>
            <th scope="col">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>message</td>
            <td>message is sent into the channel</td>
        </tr>
        <tr>
            <td>pm</td>
            <td>private message to the bot</td>
        </tr>
        <tr>
            <td>join</td>
            <td>a user joined the channel (also triggered when the bot joins a channel)</td>
        </tr>
        <tr>
            <td>invite</td>
            <td>the bot is being invited to a channel</td>
        </tr>
        <tr>
            <td>part</td>
            <td>a user leaves a channel</td>
        </tr>
        <tr>
            <td>quit</td>
            <td>a user quits a channel</td>
        </tr>
        <tr>
            <td>kick</td>
            <td>a user is kicked from a channel</td>
        </tr>
        <tr>
            <td>topic</td>
            <td>a topic has been changed on a joined channel</td>
        </tr>
        <tr>
            <td>names</td>
            <td>retrieves the list of users when the bot joins a channel</td>
        </tr>
    </tbody>
</table>
</p>
</script>




<script type="text/x-red" data-help-name="irc out">
    <p>Sends messages to a channel on an IRC server</p>
    <p>You can send just the <code>msg.payload</code>, or the complete <code>msg</code> object to the selected channel,
    or you can select to use <code>msg.topic</code> to send the <code>msg.payload</code> to a specific user (private message) or channel.</p>
    <p>If multiple output channels are listed (eg. #chan1,#chan2), then the message will be sent to all of them.</p>
    <p><b>Note:</b> you can only send to channels you have previously joined so they MUST be specified in the node - even if you then decide to use a subset in msg.topic</p>
    <p>You may send RAW commands using <code>msg.raw</code> - This must contain an array of parameters - eg. <pre>["privmsg","#nodered","Hello world"]</pre></p>
</script>


*/
