var Plugin = (function () {
    function Plugin(client) {
        this.name = 'factoids';
        this.title = 'Factoids';
        this.version = '0.1';
        this.author = 'Luke Strickland';

        this.irc = client;
    }
    Plugin.prototype.onMessage = function (from, to, message) {
        console.log(this.bot);
    };
    return Plugin;
})();
//@ sourceMappingURL=logger.js.map
