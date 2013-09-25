var fs = require('fs');
var vm = require('vm');

/**
 * Reload/load a loaded/unloaded plugin
 *
 * @param bot
 * @param namespace
 */
exports.reload = function (bot, namespace) {
	exports.unload(bot, namespace);
	exports.load(bot, namespace);
};

/**
 * This function add the plugin event into something we can work with!
 *
 * @param bot
 * @param plugin
 * @param ev
 * @param f
 * @returns {*|void}
 */
exports.addPluginEvent = function (bot, plugin, ev, f) {
	if (typeof bot.hooks[plugin ] == 'undefined') {
		bot.hooks[plugin] = [];
	}

	var callback = (function () {
		return function () {
			f.apply(that, arguments);
		};
	})();

	bot.hooks[plugin ].push({event: ev, callback: callback});

	var that = bot.plugins[plugin];
	return bot.client.addListener(ev, callback);
};

exports.addPluginCommand = function (bot, plugin, command, func) {
	bot.client.addListener('command.' + command, function (from, to, message) {
		var args = message.split(' ');
		bot.plugins[plugin][func](from, to, message, args);
	});
};

/**
 * Unload the plugin (not completed)
 *
 * @param bot
 * @param namespace
 */
exports.unload = function (bot, namespace) {
	['registered', 'motd', 'names', 'topic', 'join', 'part', 'quit', 'kick', 'kill', 'message', 'notice', 'ping', 'pm', 'ctcp', 'ctcpNotice', 'ctcpPrivmsg', 'ctcpVersion', 'nick', 'plusMode', 'minusMode', 'whois', 'channelistStart', 'channelistItem', 'channelList', 'raw', 'error'].forEach(function (event) {
		var onEvent = 'on' + event.charAt(0).toUpperCase() + event.substr(1),
			callback = bot.plugins[namespace][onEvent];

		if (typeof callback == 'function') {
			// remove listener
		}
	}, bot);
	delete bot.plugins[namespace];
};


/**
 * Load a new plugin
 *
 * @param bot
 * @param namespace
 */
exports.load = function (bot, namespace) {
	bot.debug && console.log("Loading Plugin: " + namespace);

	var name = namespace.split('/')[1];

	exports.unload(bot, namespace);


	// Load the plugin
	var pluginFile = require('../plugins/' + namespace + '/' + name);
	var pluginConfig = bot.config.plugin[name] || {};
	bot.plugins[namespace] = new pluginFile.Plugin(bot, pluginConfig);

	// Load the hooks
	['registered', 'motd', 'names', 'topic', 'join', 'part', 'quit', 'kick', 'kill', 'message', 'notice', 'ping', 'pm', 'ctcp', 'ctcpNotice', 'ctcpPrivmsg', 'ctcpVersion', 'nick', 'plusMode', 'minusMode', 'whois', 'channelistStart', 'channelistItem', 'channelList', 'raw', 'error'].forEach(function (event) {
		var onEvent = 'on' + event.charAt(0).toUpperCase() + event.substr(1),
			callback = bot.plugins[namespace][onEvent];

		if (typeof callback == 'function') {
			exports.addPluginEvent(bot, namespace, event, callback);
			bot.debug && console.log("Registered " + onEvent + " hook for " + namespace);
		}
	}, bot);

	// Load the commands
	var commands = bot.plugins[namespace].commands;
	for (var key in commands) {
		var command = key;
		var func = commands[key];
		var callback = bot.plugins[namespace][func];

		exports.addPluginCommand(bot, namespace, command, func);
	}

};

exports.getAllMethods = function (object) {
	return Object.getOwnPropertyNames(object).filter(function (property) {
		return typeof object[property] == 'function';
	});
};
