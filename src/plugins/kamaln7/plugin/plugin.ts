export class Plugin {
	bot:any;
	database:any;
	client:any;
	commands:any;
	port:number;

	constructor(bot:any) {
		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
		this.commands = {
			'plugin': 'onCommandPlugin'
		};
	}

	onCommandPlugin(from:string, to:string, message:string, args:any){
		if(this.bot.hasPermission(from, to, '@')){
			this.bot.reply(from, to, 'Authorized.');
		}
	}

}
