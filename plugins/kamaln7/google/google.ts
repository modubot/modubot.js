var google = require('google');
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
		this.name = 'google';
		this.title = 'Google Search';
		this.description = "Google module for Modubot";
		this.version = '0.1';
		this.author = 'Kamal Nasser';

		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
		this.commands = {
			'google': 'onCommandGoogle',
			'g': 'onCommandGoogle'
		};
		google.resultsPerPage = 1;
	}

	onCommandGoogle(from:string, to:string, message:string, args:any) {
		var client = this.client;
		google(args, function(err, next, links){
			client.say((to.charAt(0) == '#' ? to : from), links[0].title + ' - ' + links[0].link);
		}, client);
	}

}