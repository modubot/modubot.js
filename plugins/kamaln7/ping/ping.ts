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

	constructor(bot:any) {
		this.name = 'ping';
		this.title = 'Ping';
		this.description = "Ping module for Modubot";
		this.version = '0.1';
		this.author = 'Kamal Nasser';

		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
		this.commands = {
			'ping': 'onCommandPing'
		};

	}

	onCommandPing(from:string, to:string, message:string, args:any) {
		this.client.say((to.charAt(0) == '#' ? to : from), from + ': pong!');
	}

}