export class Plugin {
	bot:any;
	database:any;
	client:any;
	commands:any;
	config:any;
	weather:any;

	constructor(bot:any, config:any) {
		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
		this.config = config;
		this.commands = {
			'weather': 'onCommandWeather',
			'w': 'onCommandWeather'
		};
		this.weather = require('weather');
	}

	onCommandWeather(from:string, to:string, message:string, args:any) {
		if (args.length < 1) {
			this.bot.reply(from, to, this.bot.prefix + 'weather <location>', 'notice');
			return;
		}

		this.weather({location: args.join(' '), logging: true, appid: this.config.appId}, (function(data) {
			this.bot.reply(from, to, data.text + ' ' + data.temp + 'C | H: ' + data.high + 'C L: ' + data.low + 'C');
		}).bind(this));
	}

}
