var Sandbox = require('sandbox');

Plugin = exports.Plugin = function (bot) {
	this.bot = bot;
	this.client = bot.client;

	this.commands = {
		'javascript': 'evalJavascript',
		'js': 'evalJavascript'
	};
};

Plugin.prototype.evalJavascript = function (from, to, message, args) {
	var client = this.client;

	var contents = args.slice(1);
	contents = contents.join(' ');

	var s = new Sandbox();
	s.run(contents, function (output) {
		console.log(contents);
		client.say((to.substr(0, 1) === "#" ? to : from), output.result);
	})
};
