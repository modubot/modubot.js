var bf = require('./bf.js')

Plugin = exports.Plugin = function Plugin(bot) {
  this.bot = bot;
  this.commands = { 'bf' : 'onCommandBrainfuck'
                  , 'brainfuck' : 'onCommandBrainfuck' };
}

Plugin.prototype.onCommandBrainfuck = function (from, to, message, args) {
  var program = args.slice(1).join(' ');
  try {
    var compiled = bf.compile(program);
  } catch (e) {
    this.bot.reply(to, from, "Error: " + e.error);
    return;
  }
  try {
    var result = compiled.program(new MyState(compiled.comments));
    this.bot.reply(to, from, "Program successfully stopped: " + result.getResult());
  } catch (result) {
    this.bot.reply(to, from, "Program timed out: " + result.getResult());
  }
}

function MyState(input) {
  var cellSize = 3000;
  var cells = Array.apply(null, Array(cellSize)).map(function(_) { return 0; });
  var dp = 0;
  var result = [];
  var stepCounter = 0;
  var stepCounterMax = 1000;

  this.increment = function() {
    cells[dp] += 1;
    return this;
  };
  this.decrement = function() {
    cells[dp] -= 1;
    return this;
  };
  this.stepLeft = function() {
    dp = dp - 1 % cellSize;
    return this;
  };
  this.stepRight = function() {
    dp = dp + 1 % cellSize;
    return this;
  };
  this.input = function() {
    var i = input.shift();
    cells[dp] = i !== undefined ? i.charCodeAt(0) : 0;
    return this;
  };
  this.output = function() {
    result.push(String.fromCharCode(cells[dp]));
    return this;
  };
  this.isZero = function() {
    if (stepCounter++ > stepCounterMax) {
      throw this;
    }
    return cells[dp] === 0;
  };
  this.getResult = function() {
    return result.join('').substring(0, 400);
  };
}
