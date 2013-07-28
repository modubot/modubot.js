Plugin = exports.Plugin = function (client) {
	this.name = 'factoids';
	this.title = 'Factoids';
	this.version = '0.1';
	this.author = 'Luke Strickland';

	this.irc = client;

	this.factoids = [];
};

Plugin.prototype.onMessage = function (from, to, message) {

	console.log(message);

};