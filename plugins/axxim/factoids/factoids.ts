export class Plugin {
	name:string;
	title:string;
	description:string;
	version:string;
	author:string;

	bot:any;
	client:any;

	constructor(bot:any) {
		this.name = 'factoids';
		this.title = 'Factoids';
		this.description = "Factoid module for Modubot";
		this.version = '0.1';
		this.author = 'Luke Strickland';

		this.bot = bot;
		this.client = bot.client;
	}

	onMessage(from:string, to:string, message:string) {
		//console.log(message.charAt(0), this.bot.config.factoid);
		if(message.charAt(0) == this.bot.config.factoid) {
			this.client.say(to, 'Factoid!');
		}
	}

	isFactoid(command:any) {
		var configFactoid = this.bot.config.factoidPrefix;
		var factoidPrefixes = configFactoid.split(' ');

		return factoidPrefixes.indexOf(command) > -1;
	}

}
