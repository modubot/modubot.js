var modu = require('./modubot/bot');

var config = {
	host: "irc.esper.net",
	port: 6667,
	password: "",
	nick: "Modubot",
	username: "Modubot",
	realname: "Modubot",
	channels: ["#modubot"],
	command: ".",
	debug: true,

	plugins: [
		//'axxim/factoids',
		'axxim/logger',
		'axxim/url',
		'kamaln7/echo'
	],

	database: {
		host: "localhost",
		user: "",
		password: "",
		database: ""
	},

	admins: ["clone1018", "kamal"]
};

var modubot = new modu.Bot(config);
modubot.spawn();
