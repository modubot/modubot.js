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

	}

	onCommandForget(from:string, to:string, message:string, args:any) {

	}

	onCommandRemember(from:string, to:string, message:string, args:any) {
		if (args.length < 2) {
			this.client.notice(from, '.remember <factoid> <text>')
		}
		var client = this.client;

		var factoid = args[1];

		var contents = args.splice(2);
		contents = contents.join(' ');

		this.database.query(
			'INSERT INTO factoids (factoid,content,owner,channel,forgotten,locked) VALUES (?,?,?,?,0,0)',
			[factoid, contents, from, to],
			function (err, rows) {
				client.notice(from, 'Factoid "' + factoid + '" created.');
			});

	}

	onMessage(from:string, to:string, message:string) {
		var client = this.client;

		var factoid = message.split(' ')[0].replace(this.bot.config.factoid, '');

		if (this.isFactoid(message)) {

			this.database.query(
				'SELECT * FROM factoids WHERE factoid = ?',
				[factoid],
				function (err, results) {

					client.say(to, results[0].content);

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

}
