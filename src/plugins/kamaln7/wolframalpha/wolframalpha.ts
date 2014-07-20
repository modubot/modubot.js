var wolfram = require('wolfram');
export class Plugin {
	bot:any;
	database:any;
	client:any;
	commands:any;
	config:any;
	wolfram:any;

	constructor(bot:any) {
		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
        this.config = require('./package.json').config;

		this.commands = {
			'wolframalpha': 'onCommandWolframalpha',
			'wa': 'onCommandWolframalpha'
		};

		this.wolfram = wolfram.createClient(this.config.applicationId);
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

			if(!results || !results.length){
				this.bot.reply(from, to, 'No results.');
				return;
			}

            var result = results.filter(function(result) {
                return result.primary;
            }).map(function (result) {
                return result.subpods[0].value;
            }).join(' · ')
                .replace(/(\r\n|\r|\n)/gm, ' · ');

            this.bot.reply(from, to, result);
		}).bind(this));
	}

}
