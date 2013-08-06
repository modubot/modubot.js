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
		this.name = 'logger';
		this.title = 'Logger';
		this.description = "Logging module";
		this.version = '0.1';
		this.author = 'Luke Strickland';

		this.bot = bot;
		this.database = bot.database;
	}

	onMessage(to:string, from:string, message:string) {

	}

}
