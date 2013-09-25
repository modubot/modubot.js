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
	weather:any;

	constructor(bot:any, config:any) {
		this.name = 'weather';
		this.title = 'Yahoo Weather';
		this.description = "Yahoo Weather module for Modubot";
		this.version = '0.1';
		this.author = 'Kamal Nasser';

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