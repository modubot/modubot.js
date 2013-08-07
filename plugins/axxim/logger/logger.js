var Plugin = (function () {
    function Plugin(bot) {
        this.name = 'logger';
        this.title = 'Logger';
        this.description = "Logging module";
        this.version = '0.1';
        this.author = 'Luke Strickland';

        this.bot = bot;
        this.database = bot.database;
    }
    Plugin.prototype.onRaw = function (message) {
        if (message.rawCommand != 'PRIVMSG')
            return;

        var channel, from, mentions, contents;

        channel = message.args[0].charAt(0) === '#' ? message.args[0] : null;
        from = message.nick;
        mentions = null;
        contents = message.args.splice(1);
        contents = contents.join(' ');

        this.database.query('INSERT INTO logs (`channel`, `from`, `mentions`, `message`) VALUES (?,?,?,?)', [channel, from, mentions, contents], function (err, rows) {
            if (err)
                console.error(err);
        });
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=logger.js.map
