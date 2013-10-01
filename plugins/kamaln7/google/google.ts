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
	google:any;

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
		this.google = require('google');
		this.google.resultsPerPage = 1;
	}

	onCommandGoogle(from:string, to:string, message:string, args:any) {
		var query = args.splice(1).join(' ');
		this.google(query, (function(err, next, links){
			if(!err && !links.length){
				err = 'No results.';
			}

			if(err){
				this.bot.reply(from, to, err, 'notice');
				return;
			}

			this.bot.reply(from, to, links[0].title + ' - ' + links[0].link);
		}).bind(this));
	}

}