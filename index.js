console.log("Beep boop! 🤖");
const fetch = require("node-fetch");
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
  botMention = msg.content.startsWith(`<@${client.user.id}`) && msg.content.endsWith(">");
  if (botMention) {
    console.log("it worked");
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

  gotCMD(msg, cmd, args);
});

async function gotCMD(msg, cmd, args) {
  switch (cmd) {
    case "":
      msg.channel.send("It'sa me Sal-kun");
      break;

    case "hug":
      let user;
      if (args[0]) {
        user = getUserFromMention(args[0]);
        if (!user) {
          return msg.reply("Please use a proper mention, thank you.");
        }
      } else {
        user = {};
        user.username = "themselves";
      }

      let url = await getGIF("anime+hug");
      const hugEmbed = new Discord.MessageEmbed()
        .setColor("#f89e4f")
        .setTitle(`${msg.author.username} hugged ${user.username}`)
        .setImage(url);
      msg.channel.send(hugEmbed);
      break;

    case "gif":
      if (args[0]) {
        let url = await getGIF(`${args[0]}`);
        msg.channel.send(`GIF from Tenor: ${args[0]}`);
        msg.channel.send(url);
      } else {
        msg.reply("Please put a search term, thank you.");
      }
      break;

    case "ping":
      let str = `🏓 Latency is ${Date.now() - msg.createdTimestamp}ms.\nAPI Latency is ${Math.round(client.ws.ping)}ms.`;
      msg.channel.send("Pong!");
      const pingEmbed = new Discord.MessageEmbed()
        .setColor("#f89e4f")
        .setTitle(`Ping Results:`)
        .setDescription(str);
      msg.channel.send(pingEmbed);
      break;

    case "help":
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
          name: ":ping_pong: ping",
          value: "Shows ping results"
        })
      msg.channel.send(helpEmbed);
      break;
  }
}

async function getGIF(tag) {
  let res = await fetch(`https://api.tenor.com/v1/random?q=${tag}&key=${process.env.TENOR_KEY}&limit=1`)
  let data = await res.json();
  return data["results"][0]["media"][0]["gif"]["url"];
}

function getUserFromMention(mention) {
  if (!mention) return;

  if (mention.startsWith("<@") && mention.endsWith(">")) {
    mention = mention.slice(2, -1);

    if (mention.startsWith("!")) {
      mention = mention.slice(1);
    }

    return client.users.cache.get(mention);
  }
}