/*
 * Start the bot
 */
var Modu = require('./modubot/bot');

var modubot = new Modu.Bot('./config/bot.json');



var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});
} else {
	modubot.spawn();
}
