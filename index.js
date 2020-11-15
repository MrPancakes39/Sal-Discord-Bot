console.log("Beep boop! 🤖");
const fetch = require("node-fetch");
require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
client.login(`${process.env.BOT_TOKEN}`);

client.on("ready", () => console.log("I'm Ready! >.<"));
client.on("message", (msg) => {
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
        .setColor("#0099ff")
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