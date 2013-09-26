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
	port:number;

	constructor(bot:any) {
		this.name = 'plugin';
		this.title = 'Plugin Management';
		this.description = "Manage Modubot plugins";
		this.version = '0.1';
		this.author = 'Kamal Nasser';

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