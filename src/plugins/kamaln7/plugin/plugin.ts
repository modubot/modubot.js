export class Plugin {

	bot:any;
	commands:any;

	constructor(bot:any) {
		this.bot = bot;

		this.commands = {
			'plugin': 'onCommandPlugin'
		};
	}

	onCommandPlugin(from:any, to:any, message:any, args:any) {
		if (args.length < 2) {
			this.bot.reply(from, to, '.plugin <action> [namespace]', 'notice');
			return;
		}

		var plugin = this;

		switch (args[1]) {

			case "load":
				this.loadPlugin(args[2], function (err, namespace) {
					if(err) {
						plugin.bot.reply(from, to, err.toString(), 'notice');
						return;
					}

					plugin.bot.reply(from, to, 'Loaded Plugin: ' + namespace, 'notice');
				});
				break;
			case "unload":
				this.unloadPlugin(args[2], function (err) {
					if(err) {
						plugin.bot.reply(from, to, err.toString(), 'notice');
						return;
					}

				});
				break;
			case "reload":
				this.unloadPlugin(args[2], (function (err) {
					if(err) {
						plugin.bot.reply(from, to, err.toString(), 'notice');
						return;
					}

                    this.loadPlugin(args[2], function (err) {
	                    if(err) {
		                    plugin.bot.reply(from, to, err.toString(), 'notice');
		                    return;
	                    }
                    });
				}).bind(this));
				break;
			case "list":
				this.listPlugins(function (err, plugins) {
					plugin.bot.reply(from, to, 'Loaded Plugins: ' + plugins, 'notice');
				});
				break;
			default:
				plugin.bot.reply(from, to, 'Action not found, did you mean: load, unload, reload, list', 'notice');

		}

	}

	loadPlugin(namespace:string, cb: (err: any, namespace: any) => any) {
		try {
			this.bot.PluginManager.load(this.bot, namespace);

			cb(null, namespace);
		} catch(exception) {
			cb(exception, namespace);
		}
	}

	unloadPlugin(namespace:string, cb: (err: any, namespace: any) => any) {
		try {
			this.bot.PluginManager.unload(this.bot, namespace);

			cb(null, namespace);
		} catch(exception) {
			cb(exception, namespace);
		}
	}

	listPlugins(cb : (err: any, result: any) => any) {
		cb(null, Object.keys(this.bot.plugins).join(' '));
	}


}
