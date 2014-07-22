var feedsub = require('feedsub');
var moment = require('moment');
export class Plugin {
	bot:any;
	database:any;
	client:any;
	commands:any;
	config:any;
	loadedAt:any;
	readers:any;

	constructor(bot:any) {
		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
        this.config = require('./package.json').config;

		this.commands = {};
		this.loadedAt = moment();
		this.readers = [];

		this.loadReaders();
	}

	loadReaders() {
		this.config.feeds.forEach((function(feed){
			var reader = new feedsub(feed.url, {
				interval: feed.interval,
				autoStart: true
			});

			reader.on('item', (function(item){
				if(feed.after && this.loadedAt.isAfter(item[feed.after])){
					return;
				}

				feed.channels.forEach((function (channel){
                    // I need to figure out a better way to do this
                    var url = item.link.href || item.link;

					this.client.say(channel, '[' + feed.name + '] ' + item.title + ' - ' + url);
				}).bind(this));
			}).bind(this));

			reader.read();

			this.readers.push(reader);
		}).bind(this));
	}

}
