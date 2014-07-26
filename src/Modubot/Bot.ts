/// <reference path="../.ts/node.d.ts" />
/// <reference path="../.ts/js-yaml.d.ts" />
/// <reference path="../.ts/mongoose.d.ts" />
/// <reference path="../.ts/irc.d.ts" />
/// <reference path="../.ts/bunyan.d.ts" />

import path = require('path');
import fs = require('fs');
import yaml = require('js-yaml');
import mongoose = require('mongoose');
import irc = require('irc');
import Plugin = require('./Plugin');
import bunyan = require('bunyan');

export class Bot {

    PluginManager:Plugin.Plugin;


    configDir:string;

    log:any;
    chatLog:any;

    config:any;
    plugins:any = {};
    database:any;
    client:any;

    constructor(configDir:string) {
        this.configDir = configDir;

        // Load Our Stuff
        this.PluginManager = new Plugin.Plugin();

        this.log = bunyan.createLogger({
            name: 'debugLog',
            streams: [
                {
                    stream: process.stdout
                },
                {
                    type: 'rotating-file',
                    path: './logs/debug.log',
                    period: '1d',
                    count: 10
                }
            ]
        });

        var defaultConfigPath = path.join(configDir, 'default.config.yml');
        var localConfigPath = path.join(configDir, 'config.yml');

        var defaultConfigContents = fs.readFileSync(defaultConfigPath, 'utf8');
        var defaultConfig = yaml.load(defaultConfigContents);


        // Let's load our config and fallback if we need to.
        try {
            // Manually load file
            var localConfigContents = fs.readFileSync(localConfigPath, 'utf8');
            var localConfig = yaml.load(localConfigContents);

        } catch (e) {
            // Need to copy the file in sync so we can safely process.exit below
            fs.writeFileSync(localConfigPath, fs.readFileSync(defaultConfigPath));

            this.log.warn('Local config not found, copied default to config/config.yml');

            process.exit();
        }

        Object.keys(localConfig).forEach(function (key) {
            if (["network", "bot"].indexOf(key) != -1) {
                Object.keys(localConfig[key]).forEach(function (subkey) {
                    defaultConfig[key][subkey] = localConfig[key][subkey];
                });
            } else {
                defaultConfig[key] = localConfig[key];
            }
        });

        this.config = defaultConfig;
    }

    spawn() {
        var config = this.config;
        var Logger = this.log;

        this.database = mongoose;
        mongoose.connect(config.database.mongodb);
        var db = mongoose.connection;

        db.on('error', function (err) {
            Logger.error('Could not establish MongoDB connection:' + err);
        });
        db.on('open', function () {
            Logger.info('Connected to MongoDB');
        });

        Logger.info('Connecting to ' + config.network.host + ':' + config.network.port);

        this.client = new irc.Client(config.network.host, config.network.nick, {
            port: config.network.port,
            userName: config.network.username,
            realName: config.network.realname,
            channels: config.network.channels,
            sasl: config.network.sasl,
            password: config.network.password,
            secure: config.network.secure,
            selfSigned: config.network.selfSigned || false
        });

        var plugins = this.config.plugins;

        if (plugins !== null) {
            plugins.forEach(function (p) {
                this.PluginManager.load(this, p);
            }, this);
        }

        this.client.addListener('message', function (from, to, message) {
            if (message.charAt(0) == config.bot.command) {
                var command = message.split(' ')[0].substring(1);

                this.emit('command.' + command, from, to, message, message.split(' '));
            }
        });

        this.client.addListener('join', function (channel, nick, message) {
            Logger.info('Joined Channel: ', channel);
        });

        /**
         * Sends errors to plugins and if debug show them
         */
        this.client.addListener('error', function (message) {
            Logger.warn(message);
        });

        this.client.addListener('netError', function (message) {
            Logger.error(message);
        });
    }

    getReplyTo(from, to) {
        if (to.charAt(0) == '#') {
            return to;
        } else {
            return from;
        }
    }

    reply(from, to, reply, type = 'privmsg') {
        switch (type) {
            case 'privmsg':
                if (to.charAt(0) == '#') {
                    this.client.say(to, from + ': ' + reply);
                } else {
                    this.client.say(from, reply);
                }
                break;

            case 'notice':
                this.client.notice(from, reply);
                break;
        }
    }

    // DEPRECATED -- you should use hasAccess instead.
    hasPermission(from, to, mode, notice:boolean = true) {
        var modes = ['', '+', '%', '@', '&', '~'];

        if (to.charAt(0) !== '#') {
            return true;
        }
        if (!this.client.chans.hasOwnProperty(to)) {
            return false;
        }

        var hasPermission = modes.indexOf(this.client.chans[to].users[from]) >= modes.indexOf(mode);

        if (notice && !hasPermission) {
            this.reply(from, to, 'You are not authorized to do that.', 'notice');
        }

        return hasPermission;
    }

    hasAccess(from:string, to:string, modes:any, cb:any, notice:boolean = true) {
        var channelModes = ['', '+', '%', '@', '&', '~'];
        var isChannel = to.charAt(0) == '#';

        var adminOverride = true;
        var channelMode = '';
        var allowQuery = true;

        var hasPermission = true;

        if ('object' === typeof modes) {
            if (modes.hasOwnProperty('admin'))
                adminOverride = modes['admin'];

            if (modes.hasOwnProperty('channel'))
                channelMode = modes['channel'];

            if (modes.hasOwnProperty('query'))
                allowQuery = modes['query'];
        } else {
            channelMode = modes;
        }

        if (isChannel) {
            to = to.toLowerCase();
            if (!this.client.chans.hasOwnProperty(to)) {
                hasPermission = false;
            } else {
                hasPermission = channelModes.indexOf(this.client.chans[to].users[from]) >= channelModes.indexOf(channelMode);
            }
        } else {
            hasPermission = allowQuery;
        }
        if (!hasPermission && adminOverride) {
            var isAdmin = false; // TODO: Check if the user is an admin

            hasPermission = isAdmin;
        }


        cb(hasPermission);
        if (notice && !hasPermission) {
            this.reply(from, to, 'You are not authorized to do that.', 'notice');
        }
    }

}
