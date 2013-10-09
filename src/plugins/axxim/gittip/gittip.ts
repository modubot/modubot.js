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
                this.bot.client.whois(from, (function(whos) {
                    if(whos.account !== undefined) {
                        this.users[from] = {key: args[2]};
                    }
                }).bind(this));

				break;
			case "tip":

                this.bot.client.whois(from, (function(whos) {
                    if(whos.account !== undefined) {
                        this.changeTip(from, this.users[from]['key'], args[2], args[3], function tipResponse(err, body) {
                            if(err) {
                                plugin.bot.reply(from, to, 'There was a problem changing users tip.' , 'notice');
                            }

                            plugin.bot.reply(from, to, 'Tip for ' + args[2] + ' changed to $' + args[3] , 'notice');
                        });
                    }
                }).bind(this));

				break;
			default:
				plugin.bot.reply(from, to, 'Action not found, did you mean: add-key, tip', 'notice');

		}


	}

	changeTip(from:string, fromKey:string, to:string, amount:any, cb:any) {
		var url = 'https://www.gittip.com/' + from + '/tips.json';
		var data = [{
			username: to,
			platform: 'gittip',
			amount: amount
		}];



		var ned = needle.request('POST', url, data, {
            json: true,
			headers: {
                "Authorization": "Basic " + new Buffer(fromKey + ':').toString('base64'),
				"Content-Type": "application/json"
			}
		}, function(err, res, body) {
            cb(err, body);
		});
	}

}
