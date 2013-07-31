Plugin = exports.Plugin = function (bot) {
    this.name = 'echo';
    this.title = 'Echo';
    this.version = '0.1';
    this.author = 'Kamal Nasser';

    this.bot = bot;
	this.client = bot.client;
};

Plugin.prototype.onCommandPing = function(from, to, message, args, twext) {
	this.client.say((to.substr(0, 1) == '#' ? to : from), 'Pong. ' + JSON.stringify(args.split(' ')));
};

Plugin.prototype.onMessage = function (from, to, message) {
	this.client.say((to.substr(0, 1) == '#' ? to : from), message);
};
