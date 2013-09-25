var Plugin = (function () {
    function Plugin(bot, config) {
        this.name = 'weather';
        this.title = 'Yahoo Weather';
        this.description = "Yahoo Weather module for Modubot";
        this.version = '0.1';
        this.author = 'Kamal Nasser';

        this.bot = bot;
        this.database = bot.database;
        this.client = bot.client;
        this.config = config;
        this.commands = {
            'weather': 'onCommandWeather',
            'w': 'onCommandWeather'
        };
        this.weather = require('weather');
    }
    Plugin.prototype.onCommandWeather = function (from, to, message, args) {
        if (args.length < 1) {
            this.bot.reply(from, to, this.bot.prefix + 'weather <location>', 'notice');
            return;
        }

        this.weather({ location: args.join(' '), logging: true, appid: this.config.appId }, (function (data) {
            this.bot.reply(from, to, data.text + ' ' + data.temp + 'C | H: ' + data.high + 'C L: ' + data.low + 'C');
        }).bind(this));
    };
    return Plugin;
})();
exports.Plugin = Plugin;

//@ sourceMappingURL=weather.js.map
