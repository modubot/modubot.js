var url = require('url');
var http = require('http');

var Plugin = (function () {
    function Plugin(bot) {
        this.name = 'url';
        this.title = 'URL';
        this.version = '0.1';
        this.author = 'Luke Strickland';

        this.bot = bot;
        this.client = bot.client;
    }
    Plugin.prototype.onMessage = function (from, to, message) {
        var parsed = url.parse(message);
        if (parsed.hostname !== null) {
            this.client.say(to, this.getTitle(parsed));
        }
    };

    Plugin.prototype.onCommandTitle = function (from, to, message, args, text) {
        var parsed = url.parse(message);
        if (parsed.hostname !== null) {
            this.client.say(to, this.getTitle(parsed));
        }
    };

    Plugin.prototype.getTitle = function (parsed) {
        var toType = function (obj) {
            return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        };
        var re = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/g;

        var req = http.get(parsed, function (res) {
            res.on('data', function (chunk) {
                var str = chunk.toString();
                var match = re.exec(str);
                if (match && match[2]) {
                    return match[2];
                } else {
                    return "Title not found";
                }
            });
        }).on('error', function (e) {
            return "Could not connect to host: " + e;
        });
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=url.js.map
