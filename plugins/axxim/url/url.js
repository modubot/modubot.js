var url = require('url');
var http = require('http');

var Plugin = (function () {
    function Plugin(client) {
        this.name = 'url';
        this.title = 'URL';
        this.version = '0.1';
        this.author = 'Luke Strickland';

        this.irc = client;
    }
    Plugin.prototype.onMessage = function (from, to, message) {
        var bot = this.irc.client;
        console.log(bot);
        var parsed = url.parse(message);
        if (parsed.hostname !== null) {
            var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g;

            var req = http.get(parsed, function (res) {
                res.on('data', function (chunk) {
                    var str = chunk.toString();
                    var match = re.exec(str);
                    bot.say(to, match[2]);
                });
            }).on('error', function (e) {
                console.log("Got error: " + e.message);
            });
        }
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=url.js.map
