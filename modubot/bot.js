var irc = require('irc'),
	fs = require('fs'),

	plugin = require('./plugin');

Bot = exports.Bot = function (configFile) {

	this.configFile = configFile;

	var defaults = {
		host: "irc.esper.net",
		port: 6667,
		password: "",
		nick: "Modubot",
		username: "Modubot",
		realname: "Modubot",
		channels: ["#modubot"],
		command: ".",
		factoid: "?",
		debug: true,

		plugins: [
			'axxim/factoids'
		],

		database: {
			host: "localhost",
			user: "",
			password: "",
			database: ""
		},

		admins: []
	};

	if (fs.existsSync(this.configFile) === false) {
		fs.writeFileSync(this.configFile, JSON.stringify(defaults, null, '\t'));
	}

	this.config = require('../' + this.configFile);
	this.plugins = this.config.plugins;
	this.hooks = [];

};

Bot.prototype.spawn = function () {
	var config = this.config;
	var client = this.client;

	console.log('Connecting to ' + config.host);

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

	this.client.addListener('message', function (from, to, message) {
		if (message.charAt(0) == config.command) {
			var command = message.split(' ')[0].replace(config.command, '');

			this.emit('command.' + command, from, to, message);
		}
	});

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
