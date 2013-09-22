var Plugin = (function () {
    function Plugin(bot) {
        this.name = 'logger';
        this.title = 'Logger';
        this.description = "Logging module";
        this.version = '0.2';
        this.author = 'Luke Strickland';

        this.bot = bot;
        this.database = bot.database;

        this.logSchema = bot.database.Schema({
            channel: String,
            from: String,
            message: String,
            createdAt: { type: Date, default: Date.now }
        });
        this.Log = bot.database.model('Log', this.logSchema);
    }
    Plugin.prototype.onRaw = function (message) {
        if (message.rawCommand != 'PRIVMSG')
            return;

        var channel, from, contents;

        channel = message.args[0].charAt(0) === '#' ? message.args[0] : null;
        from = message.nick;
        contents = message.args.splice(1);
        contents = contents.join(' ');

        var log = new this.Log({
            channel: channel,
            from: from,
            message: contents
        });
        log.save();
    };

    Plugin.prototype.getLastXLogs = function (amount, callback) {
        this.Log.find({}, null, { sort: { createdAt: -1 }, limit: amount }, callback);
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=logger.js.map
