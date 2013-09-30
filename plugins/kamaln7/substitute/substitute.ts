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
		this.name = 'substitute';
		this.title = 'Substitute';
		this.description = "Substitute module for Modubot";
		this.version = '0.1';
		this.author = 'Kamal Nasser';

		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
		this.commands = {};
	}

	onMessage(from:string, to:string, message:string) {
		var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer condimentum porta laoreet. Nullam bibendum condimentum est, a vestibulum nisl lobortis vel.";
		var match = message.trim().match(/^s\/([^\/])+\/([^\/])*\/?$/i);
		if(match){
			var search = match[1];
			var replace = match[2];


		}
	}

}