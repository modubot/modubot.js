///<reference path='../../.ts/node.d.ts' />

import url = require('url');
import http = require('http');

export class Plugin {

	name:string;
	title:string;
	version:string;
	author:string;

	irc:any;

	constructor(client: any) {
		this.name = 'url';
		this.title = 'URL';
		this.version = '0.1';
		this.author = 'Luke Strickland';

		this.irc = client;
	}

	onMessage(from:string, to:string, message:string) {
		var bot = this.irc.client;
		console.log(bot);
		var parsed = url.parse(message);
		if (parsed.hostname !== null) {

			var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g;

			var req = http.get(parsed, function(res) {
				res.on('data', function(chunk) {
					var str = chunk.toString();
					var match = re.exec(str);
					bot.say(to, match[2]);
				});
			}).on('error', function(e) {
					console.log("Got error: " + e.message);
				});

		}
	}


}
