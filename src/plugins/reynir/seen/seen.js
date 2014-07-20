exports.Plugin = (function() {
	function Plugin(bot) {
		this.bot = bot;
		this.database = bot.database;
		this.commands = { 'seen' : 'onCommandSeen' };
		this.getLog = function() {
			var logger = this.bot.plugins['axxim/logger'];
			return logger && logger.Log;
		}.bind(this);

		this.moment = require('moment');
	}
	
	Plugin.prototype.onCommandSeen = function (from, to, message, args) {
		if (args.length < 2) {
			this.bot.client.say(from, to,
					    'Usage: ' +
					    this.bot.config.command + 'seen <nick>',
					    'notice');
			return;
		}
		var nick = args[1];
		var Log = this.getLog();
		if (!Log) {
			this.bot.log.warn('reynir/seen requires axxim/logger!');
			return;
		}
		var query = Log.findOne({from: nick}).sort('-createdAt');
		query.exec((function (err, log) {
			if (err) {
				this.bot.log.warn('seen.js: '+err);
				return;
			}
			if (!log) {
				this.bot.reply(from, to,
							   "I haven't seen "+nick+" yet.",
							   'notice');
				return;
			}
			var msg = log.from + ' was last seen ' +
				this.moment(log.createdAt).fromNow() + ' saying: ' +
				log.message;
			this.bot.reply(from, to, msg);
		}).bind(this));
	};

	return Plugin;
})();
