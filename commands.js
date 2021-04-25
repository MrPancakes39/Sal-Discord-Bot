const requireDir = require("require-dir");
const commands = requireDir("./commands");

commands["hug"] = commands["gif"] = commands["sendGIF"];
commands["aww"] = commands["memes"] = commands["fromReddit"];
commands["ping"] = commands["drama"] = commands["invite"] = commands["shortMsg"];

delete commands["sendGIF"];
delete commands["fromReddit"];
delete commands["shortMsg"];

module.exports = async function(client, msg, cmd, args) {
    if (cmd == "") {
        msg.channel.send("It'sa me Sal-kun");
    } else {
        try {
            if (Object.keys(commands).includes(cmd)) {
                commands[cmd](msg, args, cmd, client);
            }
        } catch (err) {
            console.error(err);
        }
    }
}