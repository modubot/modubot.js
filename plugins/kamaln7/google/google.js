var google = require('google');
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
        google.resultsPerPage = 1;
    }
    Plugin.prototype.onCommandGoogle = function (from, to, message, args) {
        var client = this.client;
        google(args, function (err, next, links) {
            client.say((to.charAt(0) == '#' ? to : from), links[0].title + ' - ' + links[0].link);
        }, client);
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=google.js.map
