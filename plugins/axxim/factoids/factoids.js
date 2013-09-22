var Plugin = (function () {
    function Plugin(bot) {
        this.name = 'factoids';
        this.title = 'Factoids';
        this.description = "Factoid module for Modubot";
        this.version = '0.1';
        this.author = 'Luke Strickland';

        this.bot = bot;
        this.database = bot.database;
        this.client = bot.client;
        this.commands = {
            'remember': 'onCommandRemember',
            'r': 'onCommandRemember',
            'forget': 'onCommandForget',
            'f': 'onCommandForget'
        };

        this.factoidSchema = this.database.Schema({
            factoid: String,
            content: String,
            owner: String,
            channel: String,
            forgotten: { type: Boolean, default: false },
            locked: { type: Boolean, default: false }
        });
        this.Factoid = this.database.model('Factoid', this.factoidSchema);
    }
    Plugin.prototype.onCommandForget = function (from, to, message, args) {
    };

    Plugin.prototype.onCommandRemember = function (from, to, message, args) {
        if (args.length < 2) {
            this.client.notice(from, '.remember <factoid> <text>');
        }
        var client = this.client;

        var factoidName = args[1];

        var contents = args.splice(2);
        contents = contents.join(' ');

        var plugin = this;
        this.Factoid.update({ factoid: factoidName, forgotten: false }, { $set: { forgotten: true } }, { multi: true }, function (err, numberAffected) {
            if (err) {
                plugin.bot.reply(from, to, err);
                return;
            }

            var factoid = new plugin.Factoid({
                factoid: factoidName,
                content: contents,
                owner: from,
                channel: (to.charAt(0) == '#' ? to : '')
            });
            factoid.save(function (err, factoid) {
                if (err) {
                    plugin.bot.reply(from, to, err);
                    return;
                }

                plugin.bot.reply(from, to, (numberAffected ? 'Updated' : 'Created') + ' ' + factoidName + '.');
            });
        });
    };

    Plugin.prototype.onMessage = function (from, to, message) {
        var client = this.client;

        if (this.isFactoid(message)) {
            var factoidName = message.split(' ')[0].replace(this.bot.config.factoid, '');

            var plugin = this;
            this.Factoid.findOne({ factoid: factoidName, forgotten: false }, function (err, factoid) {
                if (err) {
                    plugin.bot.reply(from, to, err);
                    return;
                }

                if (!factoid) {
                    return;
                }

                plugin.client.say(plugin.bot.getReplyTo(from, to), factoid.factoid + ': ' + factoid.content);
            });
        }
    };

    Plugin.prototype.isFactoid = function (command) {
        return (command.charAt(0) == this.bot.config.factoid);
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=factoids.js.map
