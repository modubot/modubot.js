import FactoidClass = require('./Factoid');
var Factoid = FactoidClass.Factoid;

export class Plugin {
	bot:any;
	config:any;
	database:any;
	client:any;
	commands:any;
	factoids:any;

	factoidSchema:any;
	Factoid:any;

	constructor(bot:any) {
		this.bot = bot;
		this.database = bot.database;
		this.client = bot.client;
        this.config = require('./package.json').config;

		this.commands = {
			'remember': 'onCommandRemember',
			'r': 'onCommandRemember',
			'forget': 'onCommandForget',
			'f': 'onCommandForget',
            'fsearch': 'onCommandSearch',
            'fs': 'onCommandSearch',
            'factoidUsageCount': 'onCommandUsageCount'
		};

	}

	onCommandForget(from:string, to:string, message:string, args:any) {
        this.bot.hasAccess(from, to, this.config.acl, (function(hasAccess) {
            if(!hasAccess) return;

            if (args.length < 2) {
                this.bot.reply(from, to, 'Usage: ' + args[0] + ' <factoid>', 'notice');
                return;
            }
            var factoidName = args[1].toLowerCase();

            var factoid = new Factoid(this.database);
            factoid.forgetActive(factoidName, (function(err, numAffected) {
                if(err) {
                    this.bot.log.warn(err);
                    this.bot.reply(from, to, 'An error occurred', 'notice');
                    return;
                }

                this.bot.reply(from, to, 'Forgot: ' + factoidName, 'notice');
            }).bind(this));
        }).bind(this));
	}

	onCommandRemember(from:string, to:string, message:string, args:any) {
        this.bot.hasAccess(from, to, this.config.acl, (function(hasAccess) {
            if(!hasAccess) return;

            if (args.length < 3) {
                this.bot.reply(from, to, 'Usage: ' + args[0] + ' <factoid> <text>', 'notice');
                return;
            }

            var factoidName = args[1].toLowerCase();

            var contents = args.splice(2);
            contents = contents.join(' ').trim();

            var factoid = new Factoid(this.database);

            factoid.factoid = factoidName;
            factoid.content = contents;
            factoid.owner = from;
            factoid.channel = (to.charAt(0) == '#' ? to : '');

            var plugin = this;
            factoid.save(function saveFactoid(numAffected, err, factoid) {
                if (err) {
                    plugin.bot.reply(from, to, err, 'notice');
                    return;
                }

                plugin.bot.reply(from, to, (numAffected ? 'Updated: ' : 'Added: ') + factoid.factoid + '.', 'notice');
            });
        }).bind(this));
	}

    onCommandSearch(from:string, to:string, message:string, args:string[]) {
        if (args.length < 2) {
            this.bot.reply(from, to, 'Usage: ' + args[0] + ' <search query>', 'notice');
            return;
        }

        args.shift();
        var query:string = args.join(' ');

        var factoid = new Factoid(this.database);
        factoid.search(query, (function(err:any, results:any) {
            if (err) {
                this.bot.reply(from, to, 'Sorry, an error occurred.', 'notice');
                return;
            }

            var response:string = 'No factoids found.';
            if (results.length > 0) {
                // Get the names only
                results = results.map(function (factoid) {
                    return factoid.factoid;
                });

                response = 'Found: ' + results.join(', ') + '.';
            }

            this.bot.reply(from, to, response);
        }).bind(this));
    }

    onCommandUsageCount(from:string, to:string, message:string, args:string[]) {
        if (args.length < 2) {
            this.bot.reply(from, to, 'Usage: ' + args[0] + ' <factoid>', 'notice');
            return;
        }

        var factoid = new Factoid(this.database);
        factoid.active(args[1], (function(err:any, result:any) {
            if (err) err = 'Sorry, an error occurred.';
            if (!result) err = 'Factoid not found.';

            if (err) {
                this.bot.reply(from, to, err, 'notice');
                return;
            }

            this.bot.reply(from, to, 'The factoid ' + result.factoid + ' has been used ' + result.hits.length + ' times so far.');
        }).bind(this), true);
    }

	/**
	 * Handle potential factoids by binding to the global message event.
	 *
	 * Currently handles piping, special factoids and regular factoids.
	 *
	 * @param from
	 * @param to
	 * @param message
	 */
	 onMessage(from:string, to:string, message:string) {
		if (this.isFactoid(message)) {
			var factoidName = message.split(' ')[0].replace(this.config.command, '').toLowerCase();

			var factoid = new Factoid(this.database);
			var plugin = this;

            // only used for adding a hit, temporary workaround (?)
            var fF = factoid;
			factoid.active(factoidName, (function(err, factoid) {
				if(err){
					plugin.bot.reply(from, to, err, 'notice');
					return;
				}

				if(!factoid) {
					return;
				}

                // Add a hit
                fF.hit(factoid.factoid, function(){});

				// By default no prefix
				var prefix = '';
				var pipe = message.match(/\|[ ]?([\S]+)$/i);
				if (pipe) {
					prefix = pipe[1] + ': ';
				}

				// If the factoid has an special flags inside <>'s
				var special = factoid.content.match(/^<([a-z]+)>(.*)/i);
				if(special){
					var content = special[2];
					special = special[1];
					switch(special){
						case 'alias':
							plugin.onMessage(from, to, this.config.command + content + (prefix ? (' | ' + prefix.slice(0, -2)) : ''));
							break;
						case 'cmd':
							var args = content.split(' ');
							var command = args.shift();

							// TODO: Improve this
							plugin.client.emit('command.' + command, from, to, plugin.bot.config.command + command + ' ' + args.join(' ') + ' ' + message.replace(new RegExp('/^' + plugin.config.command.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + factoidName.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + '[ ]?/i'), ''));
							break;
                        case 'action':
                            // %input%
                            var args:any = message.split(' ');
                            args.shift();
                            args = args.join(' ');
                            content = content.replace(/%input%/gi, args);

                            plugin.client.action(plugin.bot.getReplyTo(from, to), content);
                            break;
					}
				} else {
                    // Replace %input% with factoid's args.
                    var factoidContent = factoid.content.toString();
                    var args:any = message.split(' ');
                    args.shift();
                    args = args.join(' ');

                    if (prefix) {
                        args = args.replace(prefix.replace(/: $/, ''), '').replace(/[\s\|]+$/, '');
                    }

                    factoidContent = factoidContent.replace(/%input%/gi, args);
					plugin.client.say(plugin.bot.getReplyTo(from, to), prefix + factoidContent);
				}
			}).bind(this));
		}
	}

	/**
	 * Is the string a factoid?
	 *
	 * @param command
	 * @returns {boolean}
	 */
		isFactoid(command:any) {
		return (command.charAt(0) == this.config.command);
	}

	/**
	 * Are we requesting factoid information?
	 *
	 * @param command
	 * @returns {boolean}
	 */
		isFactoidInfo(command:any) {
		return (command.charAt(1) == '+');
	}

	getAllFactoids(callback){
		var factoid = new Factoid(this.database);

		factoid.findAll(callback);
	}

}
