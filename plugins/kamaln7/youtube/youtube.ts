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

				this.bot.reply(from, to, data.title + " [" + data.uploader + "] - " + data.viewCount + " views.");
			}).bind(this));
		}
	}

}