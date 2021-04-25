const requireDir = require("require-dir");
const commands = requireDir("./commands");

commands["hug"] = commands["gif"] = commands["sendGIF"];
commands["aww"] = commands["memes"] = commands["fromReddit"];

delete commands["sendGIF"];
delete commands["fromReddit"];

commands["drama"] = (msg) => {
    msg.channel.send("Ooh, There is some juicy drama ;)", {
        files: ["./assets/drama.gif"]
    })
};

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