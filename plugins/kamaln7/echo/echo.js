var plugin;

Plugin = exports.Plugin = function (client) {
    this.name = 'echo';
    this.title = 'Echo';
    this.version = '0.1';
    this.author = 'Kamal Nasser';

    this.irc = client;
    plugin = this;
    bot.addCommand('ping', function (from, to, message, args, text) {
        bot.client.say((to.substr(0, 1) == '#' ? to : from), 'Pong. ' + JSON.stringify(args.split(' ')));
    });
};

Plugin.prototype.onMessage = function (from, to, message) {
    plugin.irc.client.say((to.substr(0, 1) == '#' ? to : from), message);
};
