const Discord = require("discord.js");

module.exports = function(msg, args, cmd, client) {
    switch (cmd) {
        case "ping":
            ping(msg, client);
            break;
        case "drama":
            drama(msg);
            break;
        case "invite":
            invite(msg);
            break;
    }
}

function ping(msg, client) {
    let str = `🏓 Latency is ${Date.now() - msg.createdTimestamp}ms.\nAPI Latency is ${Math.round(client.ws.ping)}ms.`;
    msg.channel.send("Pong!");
    const pingEmbed = new Discord.MessageEmbed()
        .setColor("#f89e4f")
        .setTitle(`Ping Results:`)
        .setDescription(str);
    msg.channel.send(pingEmbed);
}

function drama(msg) {
    msg.channel.send("Ooh, There is some juicy drama ;)", {
        files: [__dirname + "/../assets/drama.gif"]
    })
};

function invite(msg) {
    let str =
        "Hey want to invite me to your own server?\nWell here is my invite link.\n\n" +
        "Invite Link: [invite me!!](https://discord.com/oauth2/authorize?client_id=776544271578562591&scope=bot)"
    const prefixEmbed = new Discord.MessageEmbed()
        .setDescription(str)
        .setColor("#f89e4f");
    msg.channel.send(prefixEmbed);
}