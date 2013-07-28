Plugin = exports.Plugin = function (client) {
	this.name = 'logger';
	this.title = 'Logger';
	this.version = '0.1';
	this.author = 'Luke Strickland';

	this.irc = client;

	this.record = [];
};

Plugin.prototype.onMessage = function (from, to, message) {

};