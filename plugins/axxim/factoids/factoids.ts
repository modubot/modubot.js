export class Plugin {
	name:string;
	title:string;
	description:string;
	version:string;
	author:string;

	bot:any;
	client:any;
    commands:any;

	constructor(bot:any) {
		this.name = 'factoids';
		this.title = 'Factoids';
		this.description = "Factoid module for Modubot";
		this.version = '0.1';
		this.author = 'Luke Strickland';

		this.bot = bot;
		this.client = bot.client;
        this.commands = {
            'remember': 'onCommandRemember',
            'r': 'onCommandRemember'
        };
	}

    onCommandRemember(from:string, to:string, message:string, args:any, text:string) {
        this.client.say(to, 'Hello');
    }

	onMessage(from:string, to:string, message:string) {
        var factoid = message.split(' ')[0].replace(this.bot.config.factoid, '');

		if(this.isFactoid(message)) {
			this.client.say(to, 'Could not find: ' + factoid);
		}
	}

	isFactoid(command:any) {
        return (command.charAt(0) == this.bot.config.factoid);
	}

}
