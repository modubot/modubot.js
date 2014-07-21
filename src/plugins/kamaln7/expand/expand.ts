var urlExpander = require('expand-url');

export class Plugin {
	bot:any;
	client:any;
	commands:any;
    urlRegex:RegExp = /\bhttps?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/i;

	constructor(bot:any) {
		this.bot = bot;
		this.client = bot.client;
		this.commands = {
			'expand': 'onCommandExpand'
		};

	}

	onCommandExpand(from:string, to:string, message:string, args:any) {
        // We don't need this in queries
        if (to.substr(0, 1) != '#') {
            return;
        }

		if (args < 2) {
            this.bot.reply(from, to, 'Usage: ' + this.bot.config.bot.command + args[0] + ' <url>', 'notice');
            return;
        }

        var url:string = args[1];
        if ( ! this.urlRegex.test(url)) {
            this.bot.reply(from, to, 'Invalid URL.', 'notice');
            return;
        }

        this.expand(from, to, url);
	}

    onMessage(from:string, to:string, message:string) {
        // We don't need this in queries
        if (to.substr(0, 1) != '#') {
            return;
        }

        var url = this.urlRegex.exec(message);
        if (url) {
            this.expand(from, to, url[0], false);
        }
    }

    expand(from:string, to:string, url:string, notifyOnErr:boolean = true) {
        urlExpander.expand({
            url: url,
            headers: {
                'User-Agent': 'Modubot.js (http://git.io/modubot.js) - kamaln7/expand v' + this.version
            }
        }, (function(err, longUrl) {
            if (err) {
                notifyOnErr && this.bot.reply(from, to, 'An error occurred.', 'notice');
                return;
            }

            if (url == longUrl) {
                return;
            }

            this.bot.reply(from, to, url + ' <=> ' + longUrl);
        }).bind(this));
    }

}