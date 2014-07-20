
export class Plugin {

	possibleHooks:any = ['registered', 'motd', 'names', 'topic', 'join', 'part', 'quit', 'kick', 'kill', 'message', 'notice', 'ping', 'pm', 'ctcp', 'ctcpNotice', 'ctcpPrivmsg', 'ctcpVersion', 'nick', 'plusMode', 'minusMode', 'whois', 'channelistStart', 'channelistItem', 'channelList', 'raw', 'error'];

	reload(bot, namespace) {
		this.unload(bot, namespace);
		this.load(bot, namespace);
	}

	addPluginEvent(bot, plugin, ev, f) {
		if (typeof bot.plugins[plugin]['hooks'] == 'undefined') {
			bot.plugins[plugin]['hooks'] = [];
		}

		// Calls a function with a given this value and arguments
		// provided as an array (or an array-like object). Also
		// sets 'this' to the plugin's class.
		var callback = (function () {
			return function () {
				f.apply(that, arguments);
			};
		})();

		bot.plugins[plugin]['hooks'].push({event: ev, callback: callback});

		// Add the event listener and make sure the callback knows about
		// the plugins class.
		var that = bot.plugins[plugin];
		return bot.client.addListener(ev, callback);
	}

	unload(bot, namespace) {

		// Unregister our events
		var hooks = bot.plugins[namespace]['hooks'];
		for(var hook in hooks) {
			if(hooks[hook].hasOwnProperty('event')) {
				bot.client.removeListener(hooks[hook]['event'], hooks[hook]['callback']);

				bot.log.info("Unregistered " + hooks[hook]['event'] + " hook for " + namespace);
			}
		}

		delete bot.plugins[namespace];
	}

	load(bot, namespace) {
		bot.log.info("Loading Plugin: " + namespace);

		var name = namespace.split('/')[1];

		try {
			var pConfig = this.loadConfiguration(namespace);
		} catch(err) {
			bot.log.error(err);
			throw err;
		}


		// Load the plugin
		var pluginFile = require('../plugins/' + namespace + '/' + pConfig.main);
		var pluginConfig = bot.config.plugin[namespace] || {};
		bot.plugins[namespace] = new pluginFile.Plugin(bot, pluginConfig);

        // Merge the plugins config into the plugin class
        for (var attrname in pConfig) {
            bot.plugins[namespace][attrname] = pConfig[attrname];
        }

		// Load the hooks
		this.possibleHooks.forEach(function (event) {
			var onEvent = 'on' + event.charAt(0).toUpperCase() + event.substr(1),
				callback = bot.plugins[namespace][onEvent];

			if (typeof callback == 'function') {
				this.PluginManager.addPluginEvent(bot, namespace, event, callback);
				bot.log.info("Registered " + onEvent + " hook for " + namespace);
			}
		}, bot);

		// Load the commands
		var commands = bot.plugins[namespace].commands;
		for (var key in commands) {
			var funcName = commands[key];
			var event = 'command.' + key;

			bot.PluginManager.addPluginEvent(bot, namespace, event, bot.plugins[namespace][funcName]);
		}

	}

	getAllMethods(object) {
		return Object.getOwnPropertyNames(object).filter(function (property) {
			return typeof object[property] == 'function';
		});
	}

	private loadConfiguration(namespace:string) {
		try {
			var configFile = require('../plugins/' + namespace + '/package.json');
		} catch(err) {
			throw err;
		}

        if ( ! configFile.main) {
            configFile.main = configFile.name;
        }

		return configFile;
	}

}