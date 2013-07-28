var Module = (function () {
    function Module(client) {
        this.name = 'factoids';
        this.title = 'Factoids';
        this.version = '0.1';
        this.author = 'Luke Strickland';

        this.irc = client;
    }
    Module.prototype.onMessage = function (from, to, message) {
        console.log(this.bot);
    };
    return Module;
})();
//@ sourceMappingURL=logger.js.map
