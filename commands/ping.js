const Discord = require("discord.js");
module.exports = function (msg, args, cmd, client) {
    let str = `🏓 Latency is ${Date.now() - msg.createdTimestamp}ms.\nAPI Latency is ${Math.round(client.ws.ping)}ms.`;
    msg.channel.send("Pong!");
    const pingEmbed = new Discord.MessageEmbed()
        .setColor("#f89e4f")
        .setTitle(`Ping Results:`)
        .setDescription(str);
    msg.channel.send(pingEmbed);
}