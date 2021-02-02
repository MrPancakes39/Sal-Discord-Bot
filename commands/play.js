const roshambo = require("./games/roshambo.js");

const games = {
    roshambo
}

module.exports = function (msg, args) {
    if (args.length == 0) {
        msg.channel.send("You must enter a game too e.g. `sal play roshambo`.");
    } else if (args.length == 1) {
        // args[0] is the game they want to play.
        games[args[0]](msg);
    } else {
        msg.reply("Sorry but I only accept 1 game not multiple lol.");
    }
}