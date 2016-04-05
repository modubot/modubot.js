export class Plugin {
  bot: any;
  commands: any;
  querystring: any;

  constructor(bot : any) {
    this.bot = bot;
    this.commands = {
      'lmgtfy': 'onCommandLmgtfy'
    };
    this.querystring = require('querystring');
  }

  onCommandLmgtfy(from: string, to: string, message: string, args: Array<string>) {
    if (args.length < 2) {
      return this.usage(from, to);
    }
    var query = this.querystring.stringify({ q : args.splice(1).join(' ') });
    this.bot.reply(from, to, 'http://lmgtfy.com/?'+query);
  }

  usage(from: string, to:string) {
    this.bot.reply(from, to, 'Usage: .lmgtfy <query>', 'notice');
  }
}
