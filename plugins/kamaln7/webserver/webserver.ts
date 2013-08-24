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
	server:any;
	port:number;

	constructor(bot:any) {
		this.name = 'webserver';
		this.title = 'Webserver';
		this.description = "Webserver module for Modubot";
		this.version = '0.1';
		this.author = 'Kamal Nasser';

		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
		this.commands = {};
		this.server = require('express')();
		this.port = this.bot.config.webserverport || 8888;
		if(this.server.listen(this.port)){
			console.log('Webserver listening on port http://localhost:' + this.port);
		} else {
			console.log('Error binding to port ' + this.port);
		}

		this.setupRoutes();
	}

	setupRoutes(){
		var plugin = this;
		this.server.get('/', function(req, res){
			res.send("Listening on port " + plugin.port + "!");
		});
		this.server.get('/status', function(req, res){
			var status = {};
			status.channels = plugin.client.chans;

			res.json(status);
		});
	}

}