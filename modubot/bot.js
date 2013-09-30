var irc = require('irc'),
	mongoose = require('mongoose'),
	plugin = require('./plugin'),
	yaml = require('js-yaml'),
	path = require('path'),
	fs = require('fs');

var util = require('util');

Bot = exports.Bot = function (configDir) {

	var defaultConfigPath = path.join(configDir, 'default.config.yml');
	var localConfigPath = path.join(configDir, 'config.yml');

	var defaultConfigContents = fs.readFileSync(defaultConfigPath, 'utf8');
	var defaultConfig = yaml.load(defaultConfigContents);


	// Let's load our config and fallback if we need to.
	try {
		// Manually load file
		var localConfigContents = fs.readFileSync(localConfigPath, 'utf8');
		var localConfig = yaml.load(localConfigContents);

	} catch(e) {
		// Need to copy the file in sync so we can safely process.exit below
		fs.writeFileSync(localConfigPath, fs.readFileSync(defaultConfigPath));

		console.info('Local config not found, copied default to config/config.yml');

		process.exit();
	}

	Object.keys(localConfig).forEach(function (key) {
		switch (key) {
			case "plugin":
				Object.keys(localConfig[key]).forEach(function (plugin) {
					if (!defaultConfig[key][plugin]) {
						defaultConfig[key][plugin] = {};
					}

					Object.keys(localConfig[key][plugin]).forEach(function (item) {
						defaultConfig[key][plugin][item] = localConfig[key][plugin][item];
					});
				});
				break;
			default:
				defaultConfig[key] = localConfig[key];
		}
	});

	this.config = defaultConfig;
	this.plugins = this.config.plugins;
	this.hooks = [];
};

Bot.prototype.spawn = function () {
	var config = this.config;

	this.database = mongoose;
	mongoose.connect(config.database.mongodb);
	var db = mongoose.connection;
	db.on('error', function(err){
		console.log('Could not establish MongoDB connection:' + err);
	});

	console.log('Connecting to ' + config.network.host + ':' + config.network.port);

	this.client = new irc.Client(config.network.host, config.network.nick, {
		port: config.network.port,
		userName: config.network.username,
		realName: config.network.realname,
		channels: config.network.channels,
		sasl: config.network.sasl,
		password: config.network.password
	});

	for (var i = 0, z = config.plugins.length; i < z; i++) {
		var p = config.plugins[i];
		plugin.load(this, p);
	}

	this.client.addListener('message', function (from, to, message) {
		if (message.charAt(0) == config.command) {
			var command = message.split(' ')[0].replace(config.command, '');

			this.emit('command.' + command, from, to, message, message.split(' '));
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

Bot.prototype.getReplyTo = function(from, to){
	if(to.charAt(0) == '#'){
		return to;
	} else {
		return from;
	}
};

Bot.prototype.reply = function(from, to, reply, type){
	if(!type){
		type = 'privmsg';
	}

	switch(type){
		case 'privmsg':
			if(to.charAt(0) == '#'){
				this.client.say(to, from + ': ' + reply);
			} else {
				this.client.say(from, reply);
			}
			break;

		case 'notice':
			this.client.notice(from, reply);
			break;
	}
};

Bot.prototype.hasPermission = function(from, to, mode, notice){
	if(typeof notice == 'undefined'){
		notice = true;
	}

	var modes = ['', '+', '%', '@', '&', '~'];

	if(to.charAt(0) !== '#'){
		return true;
	}
	if(!this.client.chans.hasOwnProperty(to)){
		return false;
	}

	var hasPermission = modes.indexOf(this.client.chans[to].users[from]) >= modes.indexOf(mode);

	if(notice && !hasPermission){
		this.reply(from, to, 'You are not authorized to do that.', 'notice');
	}

	return hasPermission;
};
