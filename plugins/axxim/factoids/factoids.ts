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
		if (args.length < 2) {
			this.client.notice(from, '.remember <factoid> <text>')
		}
		var client = this.client;

		var factoidName = args[1];

		var contents = args.splice(2);
		contents = contents.join(' ');

		var plugin = this;
		this.Factoid.update({factoid: factoidName, forgotten: false}, {$set: {forgotten: true}}, {multi: true}, function(err, numberAffected){
			if(err){
				plugin.bot.reply(from, to, err);
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

				plugin.bot.reply(from, to, (numberAffected ? 'Updated' : 'Created') + ' ' + factoidName + '.');
			});
		});
	}

	onMessage(from:string, to:string, message:string) {
		var client = this.client;

		if (this.isFactoid(message)) {
			var factoidName = message.split(' ')[0].replace(this.bot.config.factoid, '');

			var plugin = this;
			this.Factoid.findOne({factoid: factoidName, forgotten: false}, function(err, factoid){
				if(err){
					plugin.bot.reply(from, to, err);
					return;
				}

				if(!factoid){
					return;
				}

				plugin.client.say(plugin.bot.getReplyTo(from, to), factoid.factoid + ': ' + factoid.content);
			});

			/*
			var contents = this.factoids[factoid.toLowerCase()];
			var special = /<(.*?)>/ig;

			if (contents.match(special)) {
				var command = special.exec(contents)[1];
				var newMessage = message.replace(special, '');

				this.client.emit('command.' + command, from, to, newMessage, newMessage.split(' '));
				return;
			}

			this.client.say(to, contents);
			 */
		}
	}

	isFactoid(command:any) {
		return (command.charAt(0) == this.bot.config.factoid);
	}

	getAllFactoids(callback){
		this.Factoid.find({forgotten: false}, null, {sort: { factoid: 1 }}, callback);
	}

}
