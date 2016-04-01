export class Plugin {
	bot:any;
	database:any;
	client:any;
	commands:any;
	request:any;

	constructor(bot:any) {
		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
		this.commands = {
			'google': 'onCommandGoogle',
			'g': 'onCommandGoogle'
		};
    this.request = require('request');
	}

	onCommandGoogle(from:string, to:string, message:string, args:any) {
		var query = args.splice(1).join(' ');
		var _this = this;
    this.request({
      url: 'http://ajax.googleapis.com/ajax/services/search/web',
      qs: {v: '1.0', 'q': query}
    }, function(err, response, body) {
      if(err) {
          _this.bot.reply(from, to, err, 'notice');
          return;
      }

			if(response.statusCode == 200) {
				try {
					var results = JSON.parse(body);

					if(results.responseData && results.responseData.results && results.responseData.results.length > 0) {
						var result = results.responseData.results[0];
						_this.bot.reply(from, to, result.titleNoFormatting + ' - ' + result.url);
					} else {
						_this.bot.reply(from, to, 'no results.');
					}
				} catch (e) {
					_this.bot.reply(from, to, 'error: ' + e.message, 'notice');
				}
			}
    });
	}

}
