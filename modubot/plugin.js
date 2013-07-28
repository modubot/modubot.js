var fs = require('fs');

/**
 * Add plugin listener to current client
 *
 * @param bot
 * @param plugin
 * @param event
 * @param callback
 * @returns {*}
 */
exports.addListener = function (bot, plugin, event, callback) {

	return bot.client.addListener(event, callback);
};

exports.reload = function(bot, namespace) {
	exports.unload(bot, namespace);
	exports.load(bot, namespace);
};

exports.unload = function (bot, namespace) {

};


/**
 * Load a new plugin
 *
 * @param bot
 * @param namespace
 */
exports.load = function (bot, namespace) {
	if (bot.debug) {
		console.log("Loading Plugin: " + namespace);
	}

	var name = namespace.split('/')[1];

	exports.unload(bot, namespace);

	var that = bot;
	fs.readFile('./plugins/' + namespace + '/' + name + '.js', 'utf8', function (err, data) {
		if (err) {
			console.log(err);
		} else {
			eval(data);

			// Add plugin to active list
			// "Plugin" is from the actual plugin
			that.plugins[name] = new Plugin(that);

			/*
			 * Hooks
			 */
			['registered', 'motd', 'names', 'topic', 'join', 'part', 'quit', 'kick', 'kill', 'message', 'notice', 'ping', 'pm', 'ctcp', 'ctcpNotice', 'ctcpPrivmsg', 'ctcpVersion', 'nick', 'plusMode', 'minusMode', 'whois', 'channelistStart', 'channelistItem', 'channelList', 'raw', 'error'].forEach(function (event) {
				var onEvent = 'on' + event.charAt(0).toUpperCase() + event.substr(1),
					callback = this.plugins[name][onEvent];

				if (typeof callback == 'function') {
					exports.addListener(bot, name, event, callback);
				}
			}, that);
		}
	});

};
