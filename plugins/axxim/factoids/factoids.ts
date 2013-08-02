export class Plugin {
	name:string;
	title:string;
	description:string;
	version:string;
	author:string;

	bot:any;
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
		this.client = bot.client;
		this.commands = {
			'remember': 'onCommandRemember',
			'r': 'onCommandRemember',
			'forget': 'onCommandForget',
			'f': 'onCommandForget'
		};

		this.factoids = {};
	}

	onCommandForget(from:string, to:string, message:string, args:any) {

	}

	onCommandRemember(from:string, to:string, message:string, args:any) {
		if (args.length < 2) {
			this.client.notice(from, '.remember <factoid> <text>')
		}

		var factoid = args[1];

		var contents = args.splice(2);
		contents = contents.join(' ');

		this.factoids[factoid.toLowerCase()] = contents;
		this.client.notice(from, 'Factoid "' + factoid + '" created.');
	}

	onMessage(from:string, to:string, message:string) {
		var factoid = message.split(' ')[0].replace(this.bot.config.factoid, '');

		if (this.isFactoid(message)) {
			var contents = this.factoids[factoid.toLowerCase()];
			var special = /<(.*?)>/ig;

			if(contents.match(special)) {
				var command = special.exec(contents)[1];
				var newMessage = message.replace(special, '');

				this.client.emit('command.' + command, from, to, newMessage, newMessage.split(' '));
				return;
			}

			this.client.say(to, contents);
		}
	}

	isFactoid(command:any) {
		return (command.charAt(0) == this.bot.config.factoid);
	}

}
