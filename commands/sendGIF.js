const fetch = require("node-fetch");
require("dotenv").config();

const Discord = require("discord.js");
module.exports = function (msg, args, cmd) {
  if (cmd == "hug") hug(msg, args);
  if (cmd == "gif") gif(msg, args);
}

async function hug(msg, args) {
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
}

async function gif(msg, args) {
  if (args[0]) {
    let url = await getGIF(`${args[0]}`);
    msg.channel.send(`GIF from Tenor: ${args[0]}`);
    msg.channel.send(url);
  } else {
    msg.reply("Please put a search term, thank you.");
  }
}

async function getGIF(tag) {
  let res = await fetch(`https://api.tenor.com/v1/random?q=${tag}&key=${process.env.TENOR_KEY}&limit=1`);
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