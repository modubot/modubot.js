class Plugin

  constructor: (@bot) ->
    @client = bot.client
    @commands =
      'kick': 'onCommandKick'
      'ban': 'onCommandBan'
      'kickban': 'onCommandKickBan'

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

      @kick channel, nick, reason

  onCommandBan: (from, to, message, args) ->
    if args.length < 3
      @bot.reply from, to, "Usage: #{args[0]} <channel> <user>", 'notice'
      return

    @client.whois from, (whois) =>
      return if not whois.account

      channel = args[1].toLowerCase()
      nick = args[2].toLowerCase()
      account = whois.account.toLowerCase()

      if not ~@config.admins.indexOf account.toLowerCase()
        @bot.reply from, to, 'You are not authorized to do that.', 'notice'
        return

      if not ~Object.keys(@bot.client.chans).indexOf channel
        @bot.reply from, to, "Sorry, but I'm not in #{channel}.", 'notice'
        return

      @ban channel, nick

  onCommandKickBan: (from, to, message, args) ->
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

      @kick channel, nick, reason
      @ban channel, nick

  kick: (channel, user, reason) ->
    command = ['KICK', channel, user].concat reason
    @client.send.apply @client, command

  ban: (channel, user) ->
    @client.whois user, (whois) =>
      return if not whois.host

      hostmask = "*!#{whois.user}@#{whois.host}"

      command = ['MODE', channel, '+b', hostmask]
      @client.send.apply @client, command

module.exports =
  Plugin: Plugin