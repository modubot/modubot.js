var fs = require('fs');

/*
 * Create the config files required
 */

var defaultConfig = {
    host: "irc.esper.net",
    port: 6667,
    password: "",
    nick: "Modubot",
    username: "Modubot",
    realname: "Modubot",
    channels: ["#modubot"],
    command: ".",
    factoid: "?",
    debug: true,

    plugins: [
        'axxim/factoids'
    ],

    database: {
        host: "localhost",
        user: "",
        password: "",
        database: ""
    },

    admins: []
};

if(fs.existsSync('config/bot.json') === false) {
    fs.writeFileSync('config/bot.json', JSON.stringify(defaultConfig, null, '\t'));
}

var config = require('./config/bot.json');
var modu = require('./modubot/bot');

var modubot = new modu.Bot(config);
modubot.spawn();
