console.log("Beep boop! 🤖");
const commandHandler = require("./commands");
require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
client.login(`${process.env.BOT_TOKEN}`);

client.on("ready", () => {
  console.log("I'm Ready! >.<");
  client.user.setStatus("idle");
  client.user.setActivity("sal help", {
    type: "LISTENING"
  });
});
client.on("message", (msg) => {
  // If we mention the bot alone i.e. "@Sal-kun Bot" and nothing else, we have botMention.
  botMention = (msg.content.startsWith(`<@!${client.user.id}`) || msg.content.startsWith(`<@${client.user.id}`)) && msg.content.endsWith(">");
  if (botMention) {
    let str =
      "Hey looks ike you mentioned me. Well my prefix is sal.\n\n" +
      "You can try `sal help` to see the help menu."
    const prefixEmbed = new Discord.MessageEmbed()
      .setDescription(str)
      .setColor("#f89e4f");
    msg.channel.send(prefixEmbed);
    return;
  }

  // make evrything lower case and check if it starts with sal.
  let content = msg.content.toLowerCase();
  if (!(/^sal$/g.test(content) || /^sal /g.test(content))) return;

  // parses the content.
  const withoutPrefix = msg.content.slice(4);
  const split = withoutPrefix.split(/ +/);
  const cmd = split[0].toLowerCase();
  const args = split.slice(1);

  // Send it to command handler.
  commandHandler(client, msg, cmd, args);
});