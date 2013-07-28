var Plugin = (function () {
    var plugin;
    function Plugin(client) {
        this.name = 'url';
        this.title = 'URL';
        this.version = '0.1';
        this.author = 'Luke Strickland';

        this.irc = client;
        plugin = this;
    }

    Plugin.prototype.onMessage = function (from, to, message) {
        console.log([plugin.title, plugin.version].join(" "));
    };

    return Plugin;
})();