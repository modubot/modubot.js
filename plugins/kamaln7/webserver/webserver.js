var Plugin = (function () {
    function Plugin(bot) {
        this.name = 'ping';
        this.title = 'Ping';
        this.description = "Ping module for Modubot";
        this.version = '0.1';
        this.author = 'Kamal Nasser';

        this.bot = bot;
        this.database = bot.database;
        this.client = bot.client;
        this.commands = {};
        this.server = require('express')();
        this.port = this.bot.config.webserverport || 8888;
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
            res.send("Listening on port " + plugin.port + "!");
        });
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=webserver.js.map
