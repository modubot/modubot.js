export class Plugin {
	name:string;
	title:string;
	description:string;
	version:string;
	author:string;

	bot:any;
	database:any;
	client:any;
	commands:any;
	factoids:any;

	factoidSchema:any;
	Factoid:any;

	constructor(bot:any) {
		this.name = 'factoids';
		this.title = 'Factoids';
		this.description = "Factoid module for Modubot";
		this.version = '0.3';
		this.author = 'Luke Strickland';

		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
		this.commands = {
			'remember': 'onCommandRemember',
			'r': 'onCommandRemember',
			'forget': 'onCommandForget',
			'f': 'onCommandForget'
		};

		this.factoidSchema = this.database.Schema({
			factoid: String,
			content: String,
			owner: String,
			channel: String,
			forgotten: {type: Boolean, default: false},
			locked:  {type: Boolean, default: false},
			createdAt: {type: Date, default: Date.now}
		});
		this.Factoid = this.database.model('Factoid', this.factoidSchema);
	}

	onCommandForget(from:string, to:string, message:string, args:any) {

	}

	onCommandRemember(from:string, to:string, message:string, args:any) {
		if (args.length < 3) {
			this.client.reply(from, to, '.remember <factoid> <text>', 'notice');
			return;
		}

		var factoidName = args[1].toLowerCase();

		var contents = args.splice(2);
		contents = contents.join(' ').trim();

		var plugin = this;
		this.Factoid.update({factoid: factoidName, forgotten: false}, {$set: {forgotten: true}}, {multi: true}, function(err, numberAffected){
			if(err){
				plugin.bot.reply(from, to, err, 'notice');
				return;
			}

			var factoid = new plugin.Factoid({
				factoid: factoidName,
				content: contents,
				owner: from,
				channel: (to.charAt(0) == '#' ? to : '')
			});
			factoid.save(function(err, factoid){
				if(err){
					plugin.bot.reply(from, to, err);
					return;
				}

				plugin.bot.reply(from, to, (numberAffected ? 'Updated' : 'Created') + ' ' + factoidName + '.', 'notice');
			});
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
			var factoidName = message.split(' ')[0].replace(this.bot.config.factoid, '').toLowerCase();

			this.Factoid.findOne({factoid: factoidName, forgotten: false}, (function(err, factoid){
				if(err){
					this.bot.reply(from, to, err, 'notice');
					return;
				}

				if(!factoid){
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

							this.onMessage(from, to, this.bot.config.factoid + content);
							break;
						case 'cmd':
							var args = content.split(' ');
							var command = args.shift();

							// TODO: Improve this
							this.client.emit('command.' + command, from, to, this.bot.config.command + command + ' ' + args.join(' ') + ' ' + message.replace(new RegExp('/^' + this.bot.config.factoid.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + factoidName.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + '[ ]?/i'), ''));
							break;
					}
				} else {
					this.client.say(this.bot.getReplyTo(from, to), prefix + factoid.content);
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
		return (command.charAt(0) == this.bot.config.factoid);
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
		this.Factoid.find({forgotten: false}, null, {sort: { factoid: 1 }}, callback);
	}

}
