var irc = require('irc');

var plugin = require('./plugin');

Bot = exports.Bot = function (config) {

    // carry over config object to allow plugins to access it
    this.config = config || {};

    this.plugins = config.plugins || [];
	this.hooks = [];
};

Bot.prototype.spawn = function () {
    var config = this.config;

    console.log('Connecting to '+config.host);

    this.client = new irc.Client(config.host, config.nick, {
        port: config.port,
        userName: config.username,
        realName: config.realname,
        channels: config.channels
    });

    for (var i = 0, z = config.plugins.length; i < z; i++) {
        var p = config.plugins[i];
        plugin.load(this, p);
    }

    this.client.addListener('raw', function (raw) {
        if (config.debug) {
            console.log(Math.round(new Date().getTime() / 1000) + ' ' + raw.rawCommand + ' ' + raw.args.join(' '));
        }
    });

    this.client.addListener('join', function (channel, nick, message) {
        if (config.debug) {
            console.log('Joined Channel: ', channel);
        }
    });

    /**
     * Sends errors to plugins and if debug show them
     */
    this.client.addListener('error', function (message) {
        if (config.debug) {
            console.log('error: ', message);
        }
    });

};

Bot.prototype.addCommand = function (name, callback) {
    var bot = this;
    this.client.addListener('message', function (from, to, message, text) {
        var args = message.split(" "),
            command = args.shift();

        if (command == (bot.config.prefix + name)) {
            callback(from, to, message, args.join(" "), text);
        }
    }, bot);
    this.debug && console.log('Registered command ' + this.config.prefix + name);
};
