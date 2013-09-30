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
	config:any;
	plugins:any;

	constructor(bot:any, config:any) {
		this.name = 'webserver';
		this.title = 'Webserver';
		this.description = "Webserver module for Modubot";
		this.version = '0.1';
		this.author = 'Kamal Nasser';

		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
		this.commands = {};
		this.config = config;
		this.plugins = [];

		var express = require('express');
		this.port = this.config.port || 8888;

		this.server = express();
		this.server.use(express.static(__dirname + '/public'));
		this.server.set('views', __dirname + '/views');
		this.server.set('view engine', 'jade');
		this.server.locals.bot = this.bot;
		this.server.locals.plugins = this.plugins;

		if(this.server.listen(this.port)){
			console.log('Webserver listening on port http://localhost:' + this.port);
		} else {
			console.log('Error binding to port ' + this.port);
		}

		this.setupRoutes();
		this.loadPlugins();
	}

	setupRoutes(){
		var plugin = this;
		this.server.get('/', function(req, res){
			var hostname = require('os').hostname();
			var moment = require('moment');
			res.render('home', {menu: 'home', hostname: hostname, moment: moment});
		});
		this.server.get('/channels', function(req, res){
			res.render('channels', {menu: 'channels'});
		});
	}

	loadPlugins(){
		var plugin = this;
		this.bot.config.plugins.forEach(function(webserverPlugin){
			webserverPlugin = webserverPlugin.split('/')[1];
			if(typeof plugin[webserverPlugin] == 'function'){
				plugin.plugins.push(webserverPlugin);
				plugin[webserverPlugin]();
			}
		});
	}

	factoids(){
		var plugin = this;
		this.server.get('/factoids', function(req, res){
			plugin.bot.plugins['axxim/factoids'].getAllFactoids(function(err, factoids){
				if(err){
					factoids = [];
				}

				res.render('factoids', {menu: 'factoids', factoids: factoids});
			});
		});
	}

	logger(){
		var plugin = this;
		this.server.get('/logger', function(req, res){
			plugin.bot.plugins['axxim/logger'].getLastXLogs(5, function(err, logs){
				if(err){
					logs = [];
				}

				res.render('logger', {menu: 'logger', logs: logs});
			}, false);
		});
	}

}
