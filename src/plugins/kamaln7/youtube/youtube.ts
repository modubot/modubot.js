var youtubeFeeds = require('youtube-feeds');
var getYouTubeID = require('get-youtube-id');
var moment = require('moment');

export class Plugin {
	bot:any;
	database:any;
	client:any;
	commands:any;

	constructor(bot:any) {
		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
		this.commands = {};
	}

	onMessage(from:string, to:string, message:string) {
		var args = message.split(' ');

		if(args.length < 1){
			this.bot.reply(from, to, "Usage: .youtube http://youtube.com/watch?v=xyz");
			return;
		}

		var link = args[0];
		var id = getYouTubeID(link);
		if(id){
			youtubeFeeds.video(id, (function(err, data){
				if(err){
					this.bot.reply(from, to, err);
					return;
				}

				this.bot.reply(from, to,
					data.title +
					" | length " + moment.duration((data.duration * 1000)).humanize() +
					" | rated " + parseFloat(data.rating).toFixed(2) + "/5.00 | " +
					data.viewCount + " views | by " + data.uploader);
			}).bind(this));
		}
	}

}
