export class Plugin {
	bot:any;
	database:any;
	client:any;
	commands:any;

	constructor(bot:any) {
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
