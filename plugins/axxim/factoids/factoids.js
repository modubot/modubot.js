var Plugin = (function () {
    function Plugin(bot) {
        this.name = 'factoids';
        this.title = 'Factoids';
        this.description = "Factoid module for Modubot";
        this.version = '0.1';
        this.author = 'Luke Strickland';

        this.bot = bot;
        this.client = bot.client;
    }
    Plugin.prototype.onMessage = function (from, to, message) {
        if (message.charAt(0) == this.bot.config.factoid) {
            this.client.say(to, 'Factoid!');
        }
    };

    Plugin.prototype.isFactoid = function (command) {
        var configFactoid = this.bot.config.factoidPrefix;
        var factoidPrefixes = configFactoid.split(' ');

        return factoidPrefixes.indexOf(command) > -1;
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=factoids.js.map
