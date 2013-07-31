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
exports.addPluginEvent = function(bot, plugin, ev, f) {
	if (typeof bot.hooks[plugin ] == 'undefined') {
		bot.hooks[plugin] = [];
	}

	var callback = (function() {
		return function() {
			f.apply(that, arguments);
		};
	})();

	bot.hooks[plugin ].push({event: ev, callback: callback});

	var that = bot.plugins[plugin];
	return bot.client.addListener(ev, callback);
};

/**
 * Unload the plugin (not completed)
 *
 * @param bot
 * @param namespace
 */
exports.unload = function (bot, namespace) {
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
	bot.plugins[namespace] = new pluginFile.Plugin(bot);

	['registered', 'motd', 'names', 'topic', 'join', 'part', 'quit', 'kick', 'kill', 'message', 'notice', 'ping', 'pm', 'ctcp', 'ctcpNotice', 'ctcpPrivmsg', 'ctcpVersion', 'nick', 'plusMode', 'minusMode', 'whois', 'channelistStart', 'channelistItem', 'channelList', 'raw', 'error'].forEach(function (event) {
		var onEvent = 'on' + event.charAt(0).toUpperCase() + event.substr(1),
			callback = bot.plugins[namespace][onEvent];

		if (typeof callback == 'function') {
			exports.addPluginEvent(bot, namespace, event, callback);
			bot.debug && console.log("Registered " + onEvent + " hook for " + namespace);
		}
	}, bot);

};
