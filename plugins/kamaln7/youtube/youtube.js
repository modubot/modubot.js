var youtubeFeeds = require('youtube-feeds');
var getYouTubeID = require('get-youtube-id');

var Plugin = (function () {
    function Plugin(bot) {
        this.name = 'youtube';
        this.title = 'Parse Youtube links and output information';
        this.description = "Youtube module for Modubot";
        this.version = '0.1';
        this.author = 'Kamal Nasser';

        this.bot = bot;
        this.database = bot.database;
        this.client = bot.client;
        this.commands = {
            'youtube': 'onCommandYoutube',
            'yt': 'onCommandYoutube'
        };
        this.regex = /(?:https?:\/\/)?(?:(?:(?:www\.)?youtube\.com\/watch\?.*?v=([a-zA-Z0-9_\-]+))|(?:(?:www\.)?youtu\.be\/([a-zA-Z0-9_\-]+)))/i;
    }
    Plugin.prototype.onCommandYoutube = function (from, to, message, args) {
        var client = this.client;

        if (args.length < 2) {
            this.client.reply(from, to, "Usage: .youtube http://youtube.com/watch?v=xyz");
        }

        var link = args[1];
        var id = getYouTubeID(link);
        if (id) {
            var plugin = this;
            youtubeFeeds.video(id, function (err, data) {
                if (err) {
                    plugin.bot.reply(from, to, err);
                    return;
                }

                plugin.bot.reply(from, to, data.title + " [" + data.uploader + "] " + data.viewCount + " views.");
            });
        } else {
            this.bot.reply(from, to, "Invalid link.");
        }
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=youtube.js.map
