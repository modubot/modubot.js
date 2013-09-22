var Plugin = (function () {
    function Plugin(bot, config) {
        this.name = 'webserver';
        this.title = 'Webserver';
        this.description = "Webserver module for Modubot";
        this.version = '0.1';
        this.author = 'Kamal Nasser';

        this.bot = bot;
        this.database = bot.database;
        this.client = bot.client;
        this.commands = {};

        var express = require('express');
        this.port = config.webserver.port || 8888;

        this.server = express();
        this.server.use(express.static(__dirname + '/public'));
        this.server.set('views', __dirname + '/views');
        this.server.set('view engine', 'jade');
        this.server.locals.bot = this.client;

        if (this.server.listen(this.port)) {
            console.log('Webserver listening on port http://localhost:' + this.port);
        } else {
            console.log('Error binding to port ' + this.port);
        }

        this.setupRoutes();
    }
    Plugin.prototype.setupRoutes = function () {
        var plugin = this;
        this.server.get('/', function (req, res) {
            res.render('home', { menu: 'home' });
        });
        this.server.get('/channels', function (req, res) {
            res.render('channels', { menu: 'channels' });
        });
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=webserver.js.map
