var Plugin = (function () {
    function Plugin(bot) {
        this.name = 'substitute';
        this.title = 'Substitute';
        this.description = "Substitute module for Modubot";
        this.version = '0.1';
        this.author = 'Kamal Nasser';

        this.bot = bot;
        this.database = bot.database;
        this.client = bot.client;
        this.commands = {};
    }
    Plugin.prototype.onMessage = function (from, to, message) {
        var text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer condimentum porta laoreet. Nullam bibendum condimentum est, a vestibulum nisl lobortis vel.";
        var match = message.trim().match(/^s\/([^\/])+\/([^\/])*\/?$/i);
        if (match) {
            var search = match[1];
            var replace = match[2];
        }
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//# sourceMappingURL=substitute.js.map
