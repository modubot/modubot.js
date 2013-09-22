/*
 * Start the bot
 */
var Modu = require('./modubot/bot');

var modubot = new Modu.Bot('./config');
modubot.spawn();
