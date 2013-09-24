var youtubeFeeds = require('youtube-feeds');
var getYouTubeID = require('get-youtube-id');

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
	regex:any;

	constructor(bot:any) {
		this.name = 'youtube';
		this.title = 'YouTube';
		this.description = "Parse Youtube links and output information";
		this.version = '0.1';
		this.author = 'Kamal Nasser';

		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
		this.commands = {
			'youtube': 'onCommandYoutube',
			'yt': 'onCommandYoutube'
		};
		this.regex = /(?:https?:\/\/)?(?:(?:(?:www\.)?youtube\.com\/watch\?.*?v=([a-zA-Z0-9_\-]+))|(?:(?:www\.)?youtu\.be\/([a-zA-Z0-9_\-]+)))/i;
	}

	onCommandYoutube(from:string, to:string, message:string, args:any) {
		if(args.length < 2){
			this.client.reply(from, to, "Usage: .youtube http://youtube.com/watch?v=xyz");
		}

		var link = args[1];
		var id = getYouTubeID(link);
		if(id){
			var plugin = this;
			youtubeFeeds.video(id, function(err, data){
				if(err){
					plugin.bot.reply(from, to, err);
					return;
				}

				plugin.bot.reply(from, to, data.title + " [" + data.uploader + "] - " + data.viewCount + " views.");
			});
		} else {
			this.bot.reply(from, to, "Invalid link.");
		}
	}

}