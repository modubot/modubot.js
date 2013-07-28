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

	plugins: ['axxim/factoids','axxim/logger'],

	database: {
		host: "localhost",
		user: "",
		password: "",
		database: ""
	},

	admins: ["clone1018"]
};

var modubot = new modu.Bot(config);
modubot.spawn();