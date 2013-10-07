import FactoidClass = require('Factoid');
var Factoid = FactoidClass.Factoid;

export class Plugin {
	bot:any;
	config:any;
	database:any;
	client:any;
	commands:any;
	factoids:any;

	factoidSchema:any;
	Factoid:any;

	constructor(bot:any, config:any) {
		this.bot = bot;
		this.config = config;
		this.database = bot.database;
		this.client = bot.client;
		this.commands = {
			'remember': 'onCommandRemember',
			'r': 'onCommandRemember',
			'forget': 'onCommandForget',
			'f': 'onCommandForget'
		};

	}

	onCommandForget(from:string, to:string, message:string, args:any) {
		if (args.length < 2) {
			this.bot.reply(from, to, "Usage: " +
						   this.bot.config.bot.command + "f <factoid>",
						   'notice');
			return;
		}
		var factoidName = args[1].toLowerCase();


		var factoid = new Factoid(this.database);
		factoid.forgetActive(factoidName, function(err, factoid) {
			if(err) {
				console.error(err);
			}
		});
	}

	onCommandRemember(from:string, to:string, message:string, args:any) {
		if (args.length < 3) {
			this.bot.reply(from, to, '.remember <factoid> <text>', 'notice');
			return;
		}

		var factoidName = args[1].toLowerCase();

		var contents = args.splice(2);
		contents = contents.join(' ').trim();

		var factoid = new Factoid(this.database);

		factoid.factoid = factoidName;
		factoid.content = contents;
		factoid.owner = from;
		factoid.channel = (to.charAt(0) == '#' ? to : '');

		var plugin = this;
		factoid.save(function saveFactoid(err, factoid) {
			if(err) {
				plugin.bot.reply(from, to, err);
			}

			plugin.bot.reply(from, to, 'Added: ' + factoidName + '.', 'notice');
		});
	}

	/**
	 * Handle potential factoids by binding to the global message evnet.
	 *
	 * Currently handles piping, special factoids and regular factoids.
	 *
	 * @param from
	 * @param to
	 * @param message
	 */
	onMessage(from:string, to:string, message:string) {
		if (this.isFactoid(message)) {
			var factoidName = message.split(' ')[0].replace(this.config.command, '').toLowerCase();

			var factoid = new Factoid(this.database);
			var plugin = this;

			factoid.active(factoidName, (function(err, factoid) {
				if(err){
					plugin.bot.reply(from, to, err, 'notice');
					return;
				}

				if(!factoid) {
					return;
				}

				// By default no prefix
				var prefix = '';
				var pipe = message.match(/\|[ ]?([\S]+)$/i);
				if (pipe) {
					prefix = pipe[1] + ': ';
				}

				// If the factoid has an special flags inside <>'s
				var special = factoid.content.match(/^<([a-z]+)>(.*)/i);
				if(special){
					var content = special[2];
					special = special[1];
					switch(special){
						case 'alias':
							plugin.onMessage(from, to, this.config.command + content);
							break;
						case 'cmd':
							var args = content.split(' ');
							var command = args.shift();

							// TODO: Improve this
							plugin.client.emit('command.' + command, from, to, plugin.bot.config.command + command + ' ' + args.join(' ') + ' ' + message.replace(new RegExp('/^' + plugin.config.command.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + factoidName.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + '[ ]?/i'), ''));
							break;
					}
				} else {
					plugin.client.say(plugin.bot.getReplyTo(from, to), prefix + factoid.content);
				}
			}).bind(this));
		}
	}

	/**
	 * Is the string a factoid?
	 *
	 * @param command
	 * @returns {boolean}
	 */
	isFactoid(command:any) {
		return (command.charAt(0) == this.config.command);
	}

	/**
	 * Are we requesting factoid information?
	 *
	 * @param command
	 * @returns {boolean}
	 */
	isFactoidInfo(command:any) {
		return (command.charAt(1) == '+');
	}

	getAllFactoids(callback){
		var factoid = new Factoid(this.database);

        factoid.findAll(callback);
	}

}
