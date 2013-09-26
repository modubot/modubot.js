var Plugin = (function () {
    function Plugin(bot) {
        this.name = 'plugin';
        this.title = 'Plugin Management';
        this.description = "Manage Modubot plugins";
        this.version = '0.1';
        this.author = 'Kamal Nasser';

        this.bot = bot;
        this.database = bot.database;
        this.client = bot.client;
        this.commands = {
            'plugin': 'onCommandPlugin'
        };
    }
    Plugin.prototype.onCommandPlugin = function (from, to, message, args) {
        if (this.bot.hasPermission(from, to, '@')) {
            this.bot.reply(from, to, 'Authorized.');
        }
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=plugin.js.map
