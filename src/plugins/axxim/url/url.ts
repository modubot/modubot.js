///<reference path='../../../.ts/node.d.ts' />

import url = require('url');
import http = require('http');

export class Plugin {

	bot:any;
	client:any;

	constructor(bot:any) {
		this.bot = bot;
		this.client = bot.client;
	}

	onMessage(from:string, to:string, message:string) {
		var parsed = url.parse(message);
        if (parsed.hostname !== null) {
            this.getTitle(parsed, (function(response) {
                this.bot.reply(from, to, response);
            }).bind(this));
        }
	}

	onCommandTitle(from, to, message, args, text) {
		var parsed = url.parse(message);
        var plugin = this;
		if (parsed.hostname !== null) {
            this.getTitle(parsed, function(response) {
                plugin.bot.reply(from, to, response);
            });
		}
	}

	getTitle(parsed:any, cb: any) {
		var toType = function (obj) {
			return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
		};
		var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;

        if(parsed.protocol === 'http:') {
            var req = http.get(parsed,function (res) {
                res.on('data', function (chunk) {
                    var str = chunk.toString();
                    var match = re.exec(str);
                    if (match && match[2]) {
                        cb(match[2]);
                    }
                });
            }).on('error', function (e) {
                    cb("Could not connect to host: " + e);
                });
        } else {

        }


	}


}
