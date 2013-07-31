///<reference path='../../.ts/node.d.ts' />

import url = require('url');
import http = require('http');

export class Plugin {

	name:string;
	title:string;
	version:string;
	author:string;

	bot:any;
	client:any;

	constructor(bot:any) {
		this.name = 'url';
		this.title = 'URL';
		this.version = '0.1';
		this.author = 'Luke Strickland';

		this.bot = bot;
		this.client = bot.client;
	}

	onMessage(from:string, to:string, message:string) {
		var parsed = url.parse(message);
		if (parsed.hostname !== null) {
			this.client.say(to, this.getTitle(parsed));
		}
	}

	onCommandTitle(from, to, message, args, text) {
		var parsed = url.parse(message);
		if (parsed.hostname !== null) {
			this.client.say(to, this.getTitle(parsed));
		}
	}

	getTitle(parsed:any) {
		var toType = function (obj) {
			return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
		};
		var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g;

		var req = http.get(parsed,function (res) {
			res.on('data', function (chunk) {
				var str = chunk.toString();
				var match = re.exec(str);
				if (match && match[2]) {
					return match[2];
				} else {
					return "Title not found";
				}
			});
		}).on('error', function (e) {
				return "Could not connect to host: " + e;
			});
	}


}
