var Plugin = (function () {
    function Plugin(bot) {
        this.name = 'ping';
        this.title = 'Ping';
        this.description = "Ping module for Modubot";
        this.version = '0.1';
        this.author = 'Kamal Nasser';

        this.bot = bot;
        this.database = bot.database;
        this.client = bot.client;
        this.commands = {
            'ping': 'onCommandPing'
        };
    }
    Plugin.prototype.onCommandPing = function (from, to, message, args) {
        this.client.say((to.charAt(0) == '#' ? to : from), from + ': pong!');
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=ping.js.map
