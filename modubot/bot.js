var irc = require('irc');

var plugin = require('./plugin');

Bot = exports.Bot = function (config) {

    this.host = config.host || '127.0.0.1';
    this.port = config.port || 6667;
    this.password = config.password || '';
    this.nick = config.nick || 'Modubot';
    this.username = config.username || 'Modubot';
    this.realname = config.realname || 'Modubot';
    this.prefix = config.prefix || '.';
    this.channels = config.channels || [];
    this.admins = config.admins || ['clone1018'];
    this.debug = config.debug || false;

    // carry over config object to allow plugins to access it
    this.config = config || {};

    this.plugins = config.plugins || [];
    this.hooks = [];

};

Bot.prototype.spawn = function () {

    var config = this.config;

    var client = new irc.Client(this.host, this.nick, {
        userName: this.username,
        realName: this.realname,
        channels: this.channels
    });

    this.client = client;

    for (var i = 0, z = this.plugins.length; i < z; i++) {
        var p = this.plugins[i];
        plugin.load(this, p);
    }

    client.addListener('join', function (channel, nick, message) {
        if (this.debug) {
            console.log('Joined Channel: ', channel);
        }
    });

    /**
     * Sends errors to plugins and if debug show them
     */
    client.addListener('error', function (message) {
        if (this.debug) {
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