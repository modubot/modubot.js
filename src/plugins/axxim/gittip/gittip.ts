///<reference path='../../../.ts/node.d.ts' />
///<reference path='../../../.ts/needle.d.ts' />

import needle = require('needle');

export class Plugin {

	bot:any;
	commands:any = {};
	users:any = {};
	gittip:any;

	constructor(bot:any) {

		this.bot = bot;

		this.commands = {
			'gittip': 'onCommandGittip'
		};
		this.users = {};

		this.gittip = {
			hostname: 'www.gittip.com',
			port: 443,
			method: 'POST'
		};

	}

	onCommandGittip(from, to, message, args) {
		if (args.length < 2) {
			this.bot.reply(from, to, '.plugin <action> [namespace]', 'notice');
			return;
		}

		var plugin = this;

		switch (args[1]) {

			case "add-key":
				this.users[from] = {key: args[2]};

				break;
			case "tip":

				this.changeTip(from, this.users[from]['key'], args[2], args[3], function tipResponse() {

				});

				break;
			default:
				plugin.bot.reply(from, to, 'Action not found, did you mean: add-key, tip', 'notice');

		}


	}

	changeTip(from:string, fromKey:string, to:string, amount:any, cb:any) {
		var url = 'https://www.gittip.com/' + from + '/tips.json';
		var data = {
			username: to,
			platform: 'gittip',
			amount: amount
		};

		needle.post(url, JSON.stringify(data), {
			username: fromKey,
			password: '',
			headers: {
				"Content-Type": "application/json"
			}
		}, function(err, res, body) {

			console.log(err, res, body);

		});
	}

}
