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
            'r': 'onCommandRemember',
            'forget': 'onCommandForget',
            'f': 'onCommandForget'
        };

        this.factoids = {};
    }
    Plugin.prototype.onCommandForget = function (from, to, message, args) {
    };

    Plugin.prototype.onCommandRemember = function (from, to, message, args) {
        if (args.length < 2) {
            this.client.notice(from, '.remember <factoid> <text>');
        }

        var factoid = args[1];

        var contents = args.splice(2);
        contents = contents.join(' ');

        this.factoids[factoid.toLowerCase()] = contents;
        this.client.notice(to, 'Factoid "' + factoid + '" created.');
    };

    Plugin.prototype.onMessage = function (from, to, message) {
        var factoid = message.split(' ')[0].replace(this.bot.config.factoid, '');

        if (this.isFactoid(message)) {
            this.client.say(to, this.factoids[factoid.toLowerCase()]);
        }
    };

    Plugin.prototype.isFactoid = function (command) {
        return (command.charAt(0) == this.bot.config.factoid);
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=factoids.js.map
