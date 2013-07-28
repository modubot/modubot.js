var irc = require('irc');

var module = require('./module');

Bot = exports.Bot = function (config) {

	this.host = config.host || '127.0.0.1';
	this.port = config.port || 6667;
	this.password = config.password || '';
	this.nick = config.nick || 'Modubot';
	this.username = config.username || 'Modubot';
	this.realname = config.realname || 'Modubot';
	this.command = config.command || '.';
	this.channels = config.channels || [];
	this.admins = config.admins || ['clone1018'];
	this.debug = config.debug || false;

	// carry over config object to allow modules to access it
	this.config = config || {};

	this.modules = config.modules || [];
	this.hooks = [];

};

Bot.prototype.spawn = function () {

	var client = new irc.Client(this.host, this.nick, {
		userName: this.username,
		realName: this.realname,
		channels: this.channels
	});

	this.client = client;

	for (var i = 0, z = this.modules.length; i < z; i++) {
		var p = this.modules[i];
		module.load(this, p);
	}

	client.addListener('join', function (channel, nick, message) {
		if (this.debug) {
			console.log('Joined Channel: ', channel);
		}
	});

	/**
	 * Sends errors to modules and if debug show them
	 */
	client.addListener('error', function (message) {
		if (this.debug) {
			console.log('error: ', message);
		}
	});

};
