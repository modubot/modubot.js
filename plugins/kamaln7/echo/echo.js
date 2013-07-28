var plugin;

Plugin = exports.Plugin = function (client) {
	this.name = 'echo';
	this.title = 'Echo';
	this.version = '0.1';
	this.author = 'Kamal Nasser';

	this.irc = client;
	plugin = this;
};

Plugin.prototype.onMessage = function (from, to, message) {
	plugin.irc.client.say((to.substr(0, 1) == '#' ? to : from), message);
};
