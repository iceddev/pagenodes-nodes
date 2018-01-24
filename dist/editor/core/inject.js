'use strict';

var _require = require('lodash'),
    get = _require.get;

module.exports = function (PN) {
    PN.nodes.registerType('inject', {
        category: 'input',
        color: "#a6bbcf",
        defaults: {
            name: { value: "" },
            topic: { value: "" },
            payload: { value: "", validate: function validate(v) {
                    var ptype = $("#node-input-payloadType").val() || this.payloadType;
                    if (ptype === 'json') {
                        try {
                            JSON.parse(v);
                            return true;
                        } catch (err) {
                            return false;
                        }
                    } else if (ptype === 'flow' || ptype === 'global') {
                        return (/^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]+)*/i.test(v)
                        );
                    } else if (ptype === 'num') {
                        return (/^[+-]?[0-9]*\.?[0-9]*([eE][-+]?[0-9]+)?$/.test(v)
                        );
                    }
                    return true;
                } },
            payloadType: { value: "date" },
            repeat: { value: "" },
            crontab: { value: "" },
            once: { value: false },
            allowDebugInput: { value: false }
        },
        inputs: 0,
        outputs: 1,
        faChar: '&#xf061;', //arrow-right
        label: function label() {
            var suffix = "";
            if (this.repeat || this.crontab) {
                suffix = " ↻";
            }
            if (this.name) {
                return this.name + suffix;
            } else if (this.payloadType === "string" || this.payloadType === "str" || this.payloadType === "num" || this.payloadType === "bool" || this.payloadType === "json") {
                if (this.topic !== "" && this.topic.length + this.payload.length <= 32) {
                    return this.topic + ":" + this.payload + suffix;
                } else if (this.payload.length > 0 && this.payload.length < 24) {
                    return this.payload + suffix;
                } else {
                    return this._("inject.inject") + suffix;
                }
            } else if (this.payloadType === 'date') {
                return this._("inject.timestamp") + suffix;
            } else if (this.payloadType === 'flow' && this.payload.length < 19) {
                return 'flow.' + this.payload + suffix;
            } else if (this.payloadType === 'global' && this.payload.length < 17) {
                return 'global.' + this.payload + suffix;
            } else {
                return this._("inject.inject") + suffix;
            }
        },
        labelStyle: function labelStyle() {
            return this.name ? "node_label_italic" : "";
        },
        oneditprepare: function oneditprepare() {

            $("#tip-json").hide();

            if (this.payloadType == null) {
                if (this.payload == "") {
                    this.payloadType = "date";
                } else {
                    this.payloadType = "str";
                }
            } else if (this.payloadType === 'string' || this.payloadType === 'none') {
                this.payloadType = "str";
            }
            $("#node-input-payloadType").val(this.payloadType);

            $("#node-input-payload").typedInput({
                default: 'str',
                typeField: $("#node-input-payloadType"),
                types: ['str', 'num', 'bool', 'json', 'date', 'flow']
            });

            $("#inject-time-type-select").change(function () {
                $("#node-input-crontab").val('');
                var id = $("#inject-time-type-select").val();
                $(".inject-time-row").hide();
                $("#inject-time-row-" + id).show();
                if (id == "none" || id == "interval") {
                    $("#node-once").show();
                } else {
                    $("#node-once").hide();
                    $("#node-input-once").prop('checked', false);
                }
            });

            var repeattype = "none";
            if (this.repeat != "" && this.repeat != 0) {
                repeattype = "interval";
                var r = "s";
                var c = this.repeat;
                if (this.repeat % 60 === 0) {
                    r = "m";c = c / 60;
                }
                if (this.repeat % 1440 === 0) {
                    r = "h";c = c / 60;
                }
                $("#inject-time-interval-count").val(c);
                $("#inject-time-interval-units").val(r);
                $("#inject-time-interval-days").prop("disabled", "disabled");
            } else if (this.crontab) {
                var cronparts = this.crontab.split(" ");
                var days = cronparts[4];
                if (!isNaN(cronparts[0]) && !isNaN(cronparts[1])) {
                    repeattype = "time";
                    // Fixed time
                    var time = cronparts[1] + ":" + cronparts[0];
                    $("#inject-time-time").val(time);
                    $("#inject-time-type-select").val("s");
                    if (days == "*") {
                        $("#inject-time-time-days input[type=checkbox]").prop("checked", true);
                    } else {
                        $("#inject-time-time-days input[type=checkbox]").removeAttr("checked");
                        days.split(",").forEach(function (v) {
                            $("#inject-time-time-days [value=" + v + "]").prop("checked", true);
                        });
                    }
                } else {
                    repeattype = "interval-time";
                    // interval - time period
                    var minutes = cronparts[0].slice(2);
                    if (minutes === "") {
                        minutes = "0";
                    }
                    $("#inject-time-interval-time-units").val(minutes);
                    if (days == "*") {
                        $("#inject-time-interval-time-days input[type=checkbox]").prop("checked", true);
                    } else {
                        $("#inject-time-interval-time-days input[type=checkbox]").removeAttr("checked");
                        days.split(",").forEach(function (v) {
                            $("#inject-time-interval-time-days [value=" + v + "]").prop("checked", true);
                        });
                    }
                    var time = cronparts[1];
                    var timeparts = time.split(",");
                    var start;
                    var end;
                    if (timeparts.length == 1) {
                        // 0 or 0-10
                        var hours = timeparts[0].split("-");
                        if (hours.length == 1) {
                            if (hours[0] === "") {
                                start = "0";
                                end = "0";
                            } else {
                                start = hours[0];
                                end = Number(hours[0]) + 1;
                            }
                        } else {
                            start = hours[0];
                            end = Number(hours[1]) + 1;
                        }
                    } else {
                        // 23,0 or 17-23,0-10 or 23,0-2 or 17-23,0
                        var startparts = timeparts[0].split("-");
                        start = startparts[0];

                        var endparts = timeparts[1].split("-");
                        if (endparts.length == 1) {
                            end = Number(endparts[0]) + 1;
                        } else {
                            end = Number(endparts[1]) + 1;
                        }
                    }
                    $("#inject-time-interval-time-end").val(end);
                    $("#inject-time-interval-time-start").val(start);
                }
            } else {
                $("#inject-time-type-select").val("none");
            }

            $(".inject-time-row").hide();
            $("#inject-time-type-select").val(repeattype);
            $("#inject-time-row-" + repeattype).show();

            $("#node-input-payload").typedInput('type', this.payloadType);

            $("#inject-time-type-select").change();
            $("#inject-time-interval-time-start").change();

            if (get(PN, 'settings.nodes.inject.hookbase')) {
                $("#node-once").hide();
                $("#tip-json").html(PN.settings.nodes.inject.hookbase + this.id);
                $("#tip-json").show().css('font-size', '0.9em');
            }
        },
        oneditsave: function oneditsave() {
            var repeat = "";
            var crontab = "";
            var type = $("#inject-time-type-select").val();
            if (type == "none") {
                // nothing
            } else if (type == "interval") {
                var count = $("#inject-time-interval-count").val();
                var units = $("#inject-time-interval-units").val();
                if (units == "s") {
                    repeat = count;
                } else {
                    if (units == "m") {
                        //crontab = "*/"+count+" * * * "+days;
                        repeat = count * 60;
                    } else if (units == "h") {
                        //crontab = "0 */"+count+" * * "+days;
                        repeat = count * 60 * 60;
                    }
                }
            } else if (type == "interval-time") {
                repeat = "";
                var count = $("#inject-time-interval-time-units").val();
                var startTime = Number($("#inject-time-interval-time-start").val());
                var endTime = Number($("#inject-time-interval-time-end").val());
                var days = $('#inject-time-interval-time-days  input[type=checkbox]:checked').map(function (_, el) {
                    return $(el).val();
                }).get();
                if (days.length == 0) {
                    crontab = "";
                } else {
                    if (days.length == 7) {
                        days = "*";
                    } else {
                        days = days.join(",");
                    }
                    var timerange = "";
                    if (endTime == 0) {
                        timerange = startTime + "-23";
                    } else if (startTime + 1 < endTime) {
                        timerange = startTime + "-" + (endTime - 1);
                    } else if (startTime + 1 == endTime) {
                        timerange = startTime;
                    } else {
                        var startpart = "";
                        var endpart = "";
                        if (startTime == 23) {
                            startpart = "23";
                        } else {
                            startpart = startTime + "-23";
                        }
                        if (endTime == 1) {
                            endpart = "0";
                        } else {
                            endpart = "0-" + (endTime - 1);
                        }
                        timerange = startpart + "," + endpart;
                    }
                    if (count === "0") {
                        crontab = count + " " + timerange + " * * " + days;
                    } else {
                        crontab = "*/" + count + " " + timerange + " * * " + days;
                    }
                }
            } else if (type == "time") {
                var time = $("#inject-time-time").val();
                var days = $('#inject-time-time-days  input[type=checkbox]:checked').map(function (_, el) {
                    return $(el).val();
                }).get();
                if (days.length == 0) {
                    crontab = "";
                } else {
                    if (days.length == 7) {
                        days = "*";
                    } else {
                        days = days.join(",");
                    }
                    var parts = time.split(":");
                    repeat = "";
                    crontab = parts[1] + " " + parts[0] + " * * " + days;
                }
            }

            $("#node-input-repeat").val(repeat);
            $("#node-input-crontab").val(crontab);
        },
        button: {
            onclick: function onclick() {
                var label = (this.name || this.payload).replace(/&/g, /&/g, "&amp;").replace(/</g, /</g, "&lt;").replace(/>/g, />/g, "&gt;");
                if (this.payloadType === "date") {
                    label = this._("inject.timestamp");
                }
                if (this.payloadType === "none") {
                    label = this._("inject.blank");
                }
                var node = this;
                PN.comms.rpc('inject', [this.id], function (result) {
                    PN.notify(node._("inject.success", { label: label }), "success");
                });
            }
        },
        render: function render() {
            var _PN$components = PN.components,
                NameRow = _PN$components.NameRow,
                TextRow = _PN$components.TextRow,
                TypeTextRow = _PN$components.TypeTextRow;

            return React.createElement(
                'div',
                null,
                React.createElement(TypeTextRow, { name: 'payload', icon: 'envelope' }),
                React.createElement(TextRow, { name: 'topic', icon: 'tasks' }),
                React.createElement(
                    'div',
                    { className: 'form-row' },
                    React.createElement(
                        'label',
                        { htmlFor: '' },
                        React.createElement('i', { className: 'fa fa-repeat' }),
                        ' ',
                        React.createElement('span', { 'data-i18n': 'inject.label.repeat' })
                    ),
                    React.createElement(
                        'select',
                        { id: 'inject-time-type-select' },
                        React.createElement('option', { value: 'none', 'data-i18n': 'inject.none' }),
                        React.createElement('option', { value: 'interval', 'data-i18n': 'inject.interval' })
                    ),
                    React.createElement('input', { type: 'hidden', id: 'node-input-repeat' }),
                    React.createElement('input', { type: 'hidden', id: 'node-input-crontab' })
                ),
                React.createElement(
                    'div',
                    { className: 'form-row inject-time-row hidden', id: 'inject-time-row-interval' },
                    React.createElement('span', { 'data-i18n': 'inject.every' }),
                    React.createElement('input', { id: 'inject-time-interval-count', className: 'inject-time-count', value: '1' }),
                    React.createElement(
                        'select',
                        { style: { width: "100px" }, id: 'inject-time-interval-units' },
                        React.createElement('option', { value: 's', 'data-i18n': 'inject.seconds' }),
                        React.createElement('option', { value: 'm', 'data-i18n': 'inject.minutes' }),
                        React.createElement('option', { value: 'h', 'data-i18n': 'inject.hours' })
                    ),
                    React.createElement('br', null)
                ),
                React.createElement(
                    'div',
                    { className: 'form-row', id: 'node-once' },
                    React.createElement(
                        'label',
                        null,
                        '\xA0'
                    ),
                    React.createElement('input', { type: 'checkbox', id: 'node-input-once', style: { display: "inlineBlock", width: "auto", "verticalAlign": "top" } }),
                    React.createElement('label', { htmlFor: 'node-input-once', style: { width: "70%" }, 'data-i18n': 'inject.onstart' })
                ),
                React.createElement(
                    'div',
                    { className: 'form-row', id: 'node-allowDebugInput' },
                    React.createElement(
                        'label',
                        null,
                        '\xA0'
                    ),
                    React.createElement('input', {
                        type: 'checkbox',
                        id: 'node-input-allowDebugInput',
                        style: { display: "inlineBlock", width: "auto", "verticalAlign": "top" } }),
                    React.createElement(
                        'label',
                        {
                            htmlFor: 'node-input-allowDebugInput',
                            style: { width: "70%" } },
                        'allow debug panel input'
                    )
                ),
                React.createElement(NameRow, null),
                React.createElement('div', { className: 'form-tips', id: 'tip-json' })
            );
        },
        renderHelp: function renderHelp() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'p',
                    null,
                    'Pressing the button on the left side of the node allows a message on a topic to be injected into the flow. This is mainly for test purposes.'
                ),
                React.createElement(
                    'p',
                    null,
                    'The payload defaults to the current time in millisecs since 1970, but can also be set to a String or left blank.'
                ),
                React.createElement(
                    'p',
                    null,
                    'The repeat function allows the payload to be sent on the required schedule.'
                ),
                React.createElement(
                    'p',
                    null,
                    'The ',
                    React.createElement(
                        'i',
                        null,
                        'Fire once at start'
                    ),
                    ' option actually waits a short interval before firing to give other nodes a chance to instantiate properly.'
                ),
                React.createElement(
                    'p',
                    null,
                    React.createElement(
                        'b',
                        null,
                        'Note: '
                    ),
                    'all string input is escaped. To add a carriage return to a string you should use a following function.'
                )
            );
        },
        renderDescription: function renderDescription() {
            return React.createElement(
                'p',
                null,
                'Inject the action of a node'
            );
        }
    });
};