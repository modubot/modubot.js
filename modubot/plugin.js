var fs = require('fs');

exports.reload = function (bot, namespace) {
    exports.unload(bot, namespace);
    exports.load(bot, namespace);
};

exports.unload = function (bot, namespace) {
    delete bot.plugins[namespace];
};


/**
 * Load a new plugin
 *
 * @param bot
 * @param namespace
 */
exports.load = function (bot, namespace) {
    if (bot.debug) {
        console.log("Loading Plugin: " + namespace);
    }

    var name = namespace.split('/')[1];

    exports.unload(bot, namespace);

    fs.readFile('./plugins/' + namespace + '/' + name + '.js', 'utf8', function (err, data) {
        if (err) {
            console.log("Could not load " + namespace);
            console.log(err);
        } else {
            eval(data);

            // Add plugin to active list
            // "Plugin" is from the actual plugin
            bot.plugins[namespace] = new Plugin(bot);

            /*
             * Hooks
             */
            ['registered', 'motd', 'names', 'topic', 'join', 'part', 'quit', 'kick', 'kill', 'message', 'notice', 'ping', 'pm', 'ctcp', 'ctcpNotice', 'ctcpPrivmsg', 'ctcpVersion', 'nick', 'plusMode', 'minusMode', 'whois', 'channelistStart', 'channelistItem', 'channelList', 'raw', 'error'].forEach(function (event) {
                var onEvent = 'on' + event.charAt(0).toUpperCase() + event.substr(1),
                    callback = bot.plugins[namespace][onEvent];

                if (typeof callback == 'function') {
                    bot.client.addListener(event, callback);
                    bot.debug && console.log("Registered " + onEvent + " hook for " + namespace);
                }
            }, bot);

            bot.debug && console.log("Loaded " + namespace);
        }
    });

};
