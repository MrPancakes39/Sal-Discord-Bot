const fs = require("fs");
const Discord = require("discord.js");

module.exports = function(msg) {
    let descrption =
        "To use a command type: `sal <command name>` for example: `sal help`\n" +
        "You can also mention me to get help message.\n\u200B";
    const helpText = fs.readFileSync(__dirname + "/../assets/help.txt", "utf-8");
    const fields = helpText.split("---").map(field => {
        let temp = field.trim().split(",\n");
        return {
            name: temp[0],
            value: temp[1]
        }
    });
    const helpEmbed = new Discord.MessageEmbed()
        .setColor("#f89e4f")
        .setAuthor(`Sal-kun Bot's Commands:`, `https://i.imgur.com/rzvO3bA.png`)
        .setDescription(descrption)
        .addFields(...fields);
    msg.channel.send(helpEmbed);
}