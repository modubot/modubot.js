var Plugin = (function () {
    function Plugin(bot) {
        this.name = 'google';
        this.title = 'Google Search';
        this.description = "Google module for Modubot";
        this.version = '0.1';
        this.author = 'Kamal Nasser';

        this.bot = bot;
        this.database = bot.database;
        this.client = bot.client;
        this.commands = {
            'google': 'onCommandGoogle',
            'g': 'onCommandGoogle'
        };
        this.google = require('google');
        this.google.resultsPerPage = 1;
    }
    Plugin.prototype.onCommandGoogle = function (from, to, message, args) {
        var query = args.splice(1).join(' ');
        this.google(query, (function (err, next, links) {
            if (!err && !links.length) {
                err = 'No results.';
            }

            if (err) {
                this.bot.reply(from, to, err, 'notice');
                return;
            }

            this.bot.reply(from, to, links[0].title + ' - ' + links[0].link);
        }).bind(this));
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//# sourceMappingURL=google.js.map
