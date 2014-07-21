class Plugin

  constructor: (@bot) ->
    @client = bot.client
    @commands =
      'help': 'onCommandHelp'
    @commandDescriptions =
      'help': "Get loaded plugins and available commands or info about a command | Usage: #{@bot.config.bot.command}help <plugin/command>?"

  onCommandHelp: (from, to, message, args) ->
    plugins = Object.keys(@bot.plugins)

    if args.length is 1
      commands = []

      @client.notice from, "Loaded plugins: #{plugins.join ', '}"

      plugins.forEach (plugin) =>
        pluginCommands = @bot.plugins[plugin].commands
        if typeof pluginCommands is 'object'
          commands = commands.concat Object.keys(pluginCommands)

      @client.notice from, "Available commands: #{commands.join ', '}"
    else
      arg = args[1].toLowerCase()

      # Is it a plugin?
      if @bot.plugins[arg]?
        plugin = @bot.plugins[arg]
        description = plugin.description
        commands = if typeof plugin.commands is 'object' then Object.keys(plugin.commands) else []

        @client.notice from, "#{arg} - #{description}"
        if commands.length > 0
          @client.notice from, "Available commands: #{commands.join ', '}"
      else
        # Probably a command
        found = false
        for plugin in Object.keys(@bot.plugins)
          commands = @bot.plugins[plugin].commands
          return if typeof commands isnt 'object'

          if ~Object.keys(commands).indexOf arg
            found = true

            description = @bot.plugins[plugin].description
            commandDescription = if typeof @bot.plugins[plugin].commandDescriptions is 'object' then @bot.plugins[plugin].commandDescriptions[arg] else ''

            @client.notice from, "#{plugin} - #{description}"
            @client.notice from, "#{arg}: #{commandDescription}"

            break
        if not found
          # Neither a plugin nor a command
          # Call help without any arguments
          @onCommandHelp from, to, message, [args[0]]

  module.exports =
    Plugin: Plugin