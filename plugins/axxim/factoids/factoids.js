var Plugin = (function () {
    function Plugin(bot) {
        this.name = 'factoids';
        this.title = 'Factoids';
        this.description = "Factoid module for Modubot";
        this.version = '0.1';
        this.author = 'Luke Strickland';

        this.bot = bot;
        this.client = bot.client;
        this.commands = {
            'remember': 'onCommandRemember',
            'r': 'onCommandRemember'
        };
    }
    Plugin.prototype.onCommandRemember = function (from, to, message, args, text) {
        this.client.say(to, 'Hello');
    };

    Plugin.prototype.onMessage = function (from, to, message) {
        var factoid = message.split(' ')[0].replace(this.bot.config.factoid, '');

        if (this.isFactoid(message)) {
            this.client.say(to, 'Could not find: ' + factoid);
        }
    };

    Plugin.prototype.isFactoid = function (command) {
        return (command.charAt(0) == this.bot.config.factoid);
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=factoids.js.map
