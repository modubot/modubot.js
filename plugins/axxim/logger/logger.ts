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

	constructor(bot:any) {
		this.name = 'logger';
		this.title = 'Logger';
		this.description = "Logging module";
		this.version = '0.1';
		this.author = 'Luke Strickland';

		this.bot = bot;
		this.database = bot.database;
	}

	onRaw(message:any) {
		// We only want to log if this is a privmsg
		if (message.rawCommand != 'PRIVMSG') return;

		var channel, from, mentions, contents;

		channel = message.args[0].charAt(0) === '#' ? message.args[0] : null;
		from = message.nick;
		mentions = null;
		contents = message.args.splice(1);
		contents = contents.join(' ');

		this.database.query(
			'INSERT INTO logs (`channel`, `from`, `mentions`, `message`) VALUES (?,?,?,?)',
			[channel, from, mentions, contents], function (err, rows) {
				if (err) console.error(err);
			});
	}

}
