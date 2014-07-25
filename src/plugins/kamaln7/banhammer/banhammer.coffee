class Plugin

  constructor: (@bot) ->
    @client = bot.client
    @commands =
      'kick': 'onCommandKick'

  onCommandKick: (from, to, message, args) ->
    if args.length < 3
      @bot.reply from, to, "Usage: #{args[0]} <channel> <user>", 'notice'
      return

    @client.whois from, (whois) =>
      return if not whois.account

      args.shift()
      channel = args.shift().toLowerCase()
      nick = args.shift().toLowerCase()
      reason = args.join(' ')
      account = whois.account.toLowerCase()

      if not ~@config.admins.indexOf account.toLowerCase()
        @bot.reply from, to, 'You are not authorized to do that.', 'notice'
        return

      if not ~Object.keys(@bot.client.chans).indexOf channel
        @bot.reply from, to, "Sorry, but I'm not in #{channel}.", 'notice'
        return

      # Kick the user
      command = ['KICK', channel, nick].concat reason
      console.log command
      @client.send.apply @client, command

module.exports =
  Plugin: Plugin