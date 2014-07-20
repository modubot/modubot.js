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
		// /s\/(([^\/])+)\/(([^\/])*)\/?/i
        // /^([sm])\/(.*?(?<!\\\\))\/(?:(.*?(?<!\\\\))\/)?([a-z]*)/i    https://github.com/clone1018/Shocky/blob/8c0b59db25e0ad8dc5d9bc87fdd5af919da317ce/modulesrc/ModuleRegexReplace.java#L33
	}

}
