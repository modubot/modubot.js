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
	factoids:any;

	logSchema:any;
	Log:any;

	constructor(bot:any) {
		this.name = 'logger';
		this.title = 'Logger';
		this.description = "Logging module";
		this.version = '0.2';
		this.author = 'Luke Strickland';

		this.bot = bot;
		this.database = bot.database;

		this.logSchema = bot.database.Schema({
			channel: String,
			from: String,
			message: String,
			createdAt: {type: Date, default: Date.now}
		});
		this.Log = bot.database.model('Log', this.logSchema);
	}

	onRaw(message:any) {
		// We only want to log if this is a privmsg
		if (message.rawCommand != 'PRIVMSG') return;

		var channel, from, contents;

		channel = message.args[0].charAt(0) === '#' ? message.args[0] : null;
		from = message.nick;
		contents = message.args.splice(1);
		contents = contents.join(' ');

		var log = new this.Log({
			channel: channel,
			from: from,
			message: contents
		});
		log.save();
	}

	getLastXLogs(amount:number, callback, includePrivate = true) {
		var search = {};
		if(!includePrivate){
			search = {
				channel: {$ne: ''}
			};
		}
		this.Log.find(search, null, {sort: { createdAt: -1 }, limit: amount}, callback);
	}

}
