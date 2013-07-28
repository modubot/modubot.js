var fs = require('fs');

exports.reload = function (bot, namespace) {
	exports.unload(bot, namespace);
	exports.load(bot, namespace);
};

exports.unload = function (bot, namespace) {
	delete bot.modules[namespace];
};


/**
 * Load a new module
 *
 * @param bot
 * @param namespace
 */
exports.load = function (bot, namespace) {
	if (bot.debug) {
		console.log("Loading Modules: " + namespace);
	}

	var name = namespace.split('/')[1];

	exports.unload(bot, namespace);

	fs.readFile('./modules/' + namespace + '/' + name + '.js', 'utf8', function (err, data) {
		if (err) {
			console.log(err);
		} else {
			eval(data);

			// Add module to active list
			// "Module" is from the actual module
			bot.modules[namespace] = new Module(bot);

			/*
			 * Hooks
			 */
			['registered', 'motd', 'names', 'topic', 'join', 'part', 'quit', 'kick', 'kill', 'message', 'notice', 'ping', 'pm', 'ctcp', 'ctcpNotice', 'ctcpPrivmsg', 'ctcpVersion', 'nick', 'plusMode', 'minusMode', 'whois', 'channelistStart', 'channelistItem', 'channelList', 'raw', 'error'].forEach(function (event) {
				var onEvent = 'on' + event.charAt(0).toUpperCase() + event.substr(1),
					callback = bot.modules[namespace][onEvent];

				if (typeof callback == 'function') {
					bot.client.addListener(event, callback);
				}
			}, bot);
		}
	});

};
