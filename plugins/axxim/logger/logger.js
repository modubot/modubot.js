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
    Plugin.prototype.onMessage = function (to, from, message) {
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=logger.js.map
