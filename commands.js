const sendGIF = require("./commands/sendGIF.js");
const ping = require("./commands/ping.js");
const help = require("./commands/help.js");
const play = require("./commands/play.js");

const commands = {
    hug: sendGIF,
    gif: sendGIF,
    ping,
    help,
    play
}

module.exports = async function (client, msg, cmd, args) {
    if (cmd == "") {
        msg.channel.send("It'sa me Sal-kun");
    } else {
        commands[cmd](msg, args, cmd, client);
    }
}