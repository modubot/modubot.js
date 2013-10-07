
export class Plugin {

	reload(bot, namespace) {
		this.unload(bot, namespace);
		this.load(bot, namespace);
	}

	addPluginEvent(bot, plugin, ev, f) {
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
	}

	addPluginCommand(bot, plugin, command, func) {
		bot.client.addListener('command.' + command, function (from, to, message) {
			var args = message.split(' ');
			bot.plugins[plugin][func](from, to, message, args);
		});
	}

	unload(bot, namespace) {
		delete bot.plugins[namespace];
	}

	load(bot, namespace) {
		console.log("Loading Plugin: " + namespace);

		var name = namespace.split('/')[1];
		var pConfig = this.loadConfiguration(namespace);

		// Load the plugin
		var pluginFile = require('../plugins/' + namespace + '/' + pConfig.mainFile);
		var pluginConfig = bot.config.plugin[namespace] || {};
		bot.plugins[namespace] = new pluginFile.Plugin(bot, pluginConfig);

        // Merge the plugins config into the plugin class
        for (var attrname in pConfig) {
            bot.plugins[namespace][attrname] = pConfig[attrname];
        }

		// Load the hooks
		['registered', 'motd', 'names', 'topic', 'join', 'part', 'quit', 'kick', 'kill', 'message', 'notice', 'ping', 'pm', 'ctcp', 'ctcpNotice', 'ctcpPrivmsg', 'ctcpVersion', 'nick', 'plusMode', 'minusMode', 'whois', 'channelistStart', 'channelistItem', 'channelList', 'raw', 'error'].forEach(function (event) {
			var onEvent = 'on' + event.charAt(0).toUpperCase() + event.substr(1),
				callback = bot.plugins[namespace][onEvent];

			if (typeof callback == 'function') {
				this.PluginManager.addPluginEvent(bot, namespace, event, callback);
				console.log("Registered " + onEvent + " hook for " + namespace);
			}
		}, bot);

		// Load the commands
		var commands = bot.plugins[namespace].commands;
		for (var key in commands) {
			var command = key;
			var func = commands[key];
			var callback = bot.plugins[namespace][func];

			this.addPluginCommand(bot, namespace, command, func);
		}

	}

	getAllMethods(object) {
		return Object.getOwnPropertyNames(object).filter(function (property) {
			return typeof object[property] == 'function';
		});
	}

	private loadConfiguration(namespace:string) {
		var pluginConfig = new PluginConfig();
		var configFile = require('../plugins/' + namespace + '/plugin.json');

		pluginConfig.name = configFile.name;
		pluginConfig.title = configFile.title;
		pluginConfig.description = configFile.description;
		pluginConfig.version = configFile.version;
		pluginConfig.author = configFile.author;
		pluginConfig.requires = configFile.requires;
		pluginConfig.nodeRequires = configFile.nodeRequires;
		pluginConfig.mainFile = configFile.mainFile || configFile.name;

		return pluginConfig;
	}

}

class PluginConfig {
	name: string;
	title: string;
	description: string;
	version: string;
	author: string;
	requires: any;
	nodeRequires: any;
	mainFile:any;
}

/*
interface PluginConfig {
	name: string;
	title: string;
	description: string;
	version: string;
	author: string;
	requires: any;
	nodeRequires: any;
}
*/
