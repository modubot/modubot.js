var wolfram = require('wolfram');
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
	config:any;
	wolfram:any;

	constructor(bot:any, config:any) {
		this.name = 'wolframalpha';
		this.title = 'Wolframalpha';
		this.description = "Wolframalpha plugin for Modubot";
		this.version = '0.1';
		this.author = 'Kamal Nasser';

		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
		this.config = config;
		this.commands = {
			'wolframalpha': 'onCommandWolframalpha',
			'wa': 'onCommandWolframalpha'
		};

		this.wolfram = wolfram.createClient(config.applicationId);
	}

	onCommandWolframalpha(from:string, to:string, message:string, args:any) {
		if (args.length < 2) {
			this.bot.reply(from, to, 'Usage: .wolframalpha <query>', 'notice');
			return;
		}

		var query = args;
		query.shift();
		query = query.join(' ');
		this.wolfram.query(query, (function(err, results){
			if(err){
				this.bot.reply(from, to, err, 'notice');
				return;
			}

			if(!results.length){
				this.bot.reply(from, to, 'No results.');
				return;
			}

			results.forEach((function(result){
				if(result.primary){
					var result = result.subpods;
					this.bot.reply(from, to, result[0].value);
				}
			}).bind(this));
		}).bind(this));
	}

}