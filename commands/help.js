const Discord = require("discord.js");

module.exports = function (msg) {
    let descrption =
        "To use a command type: `sal <command name>` for example: `sal help`\n" +
        "You can also mention me to get help message.\n\u200B";
    const helpEmbed = new Discord.MessageEmbed()
        .setColor("#f89e4f")
        .setAuthor(`Sal-kun Bot's Commands:`, `https://i.imgur.com/rzvO3bA.png`)
        .setDescription(descrption)
        .addFields({
            name: ":tools: help",
            value: "Shows help message"
        }, {
            name: ":hugging: hug",
            value: "`hug` to hug yourself\n`hug <username>` to hug a user"
        }, {
            name: ":stuck_out_tongue_closed_eyes: gif",
            value: "`gif term` to give you a GIF"
        }, {
            name: ":cat: aww",
            value: "Will make you go 'aww' from r/aww"
        }, {
            name: ":joy: memes",
            value: "Gives you some memes from r/memes"
        }, {
            name: ":game_die: play",
            value: "`play roshambo` to play rock, paper, scissors.\n`More Coming Soon...`"
        }, {
            name: ":ping_pong: ping",
            value: "Shows ping results"
        })
    msg.channel.send(helpEmbed);
}