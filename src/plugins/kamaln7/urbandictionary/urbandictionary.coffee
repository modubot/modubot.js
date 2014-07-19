request = require 'request'

class Plugin

  constructor: (@bot) ->
    @client = bot.client
    @commands =
      'urbandictionary': 'onCommandLookup'
      'ud': 'onCommandLookup'

  onCommandLookup: (from, to, message, args) ->
    if args.length < 2
      @bot.reply from, to, "Usage: #{@bot.config.bot.command + args[0]} <query>", 'notice'
      return

    args.shift()
    page = 1
    if args.length > 1 and not isNaN args[args.length - 1]
      page = args.pop()
    term = args.join(' ')

    @lookUp term, page, (err, result) =>
      if err
        @bot.reply from, to, err, 'notice'
      else
        # Replace new lines with ·
        definition = result.result.definition.replace(/(\r\n|\r|\n)/gm, ' · ')

        @bot.reply from, to, "#{term}:[#{page}/#{result.pages}]: #{definition}"

  lookUp: (term, page, cb) ->
    url = "http://api.urbandictionary.com/v0/define?term=#{encodeURIComponent(term)}"

    request url, (err, res, body) =>
      if err
        @bot.reply from, to, 'An error occurred.', 'notice'
        return

      response = {}
      err = null
      try
        data = JSON.parse body
        if not data.list
          err = 'Not found.'
        else
          if page > data.list.length
            err = "Page out of range [1-#{data.list.length}]"
          else
            page--
            if page < 0 then page = 0

            response =
              pages: data.list.length
              result: data.list[page]
      catch error
        err = 'An error occurred.'
      finally
        cb(err, response)

  module.exports =
    Plugin: Plugin