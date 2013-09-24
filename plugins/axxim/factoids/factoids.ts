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
		this.version = '0.1';
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

		var factoidName = args[1];

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

	onMessage(from:string, to:string, message:string) {
		if (this.isFactoid(message)) {
			var factoidName = message.split(' ')[0].replace(this.bot.config.factoid, '');

			this.Factoid.findOne({factoid: factoidName, forgotten: false}, (function(err, factoid){
				if(err){
					this.bot.reply(from, to, err, 'notice');
					return;
				}

				if(!factoid){
					return;
				}

				var prefix = factoid.factoid;
				var pipe = message.match(/\|[ ]?([\S]+)$/i);
				if (pipe) {
					prefix = pipe[1];
				}

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
					this.client.say(this.bot.getReplyTo(from, to), prefix + ': ' + factoid.content);
				}
			}).bind(this));
		}
	}

	isFactoid(command:any) {
		return (command.charAt(0) == this.bot.config.factoid);
	}

	getAllFactoids(callback){
		this.Factoid.find({forgotten: false}, null, {sort: { factoid: 1 }}, callback);
	}

}
