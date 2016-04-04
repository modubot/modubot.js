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
			'version': 'onCommandVersion'
		};

	}

	onCommandVersion(from:string, to:string, message:string, args:any) {
		this.bot.reply(from, to, 'Modubot v' + this.bot.version);
	}

}
