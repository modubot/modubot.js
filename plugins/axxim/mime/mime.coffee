Plugin = (->
  Plugin = (bot) ->
    @name = "mime"
    @title = "mime"
    @description = "Example CoffeeScript mime."
    @version = "0.1"
    @author = "Luke Strickland"
    @bot = bot
    @client = bot.client
  Plugin::onMessage = (from, to, message) ->
    @client.say ((if to.substr(0, 1) is "#" then to else from)), message

  Plugin)()
exports.Plugin = Plugin
