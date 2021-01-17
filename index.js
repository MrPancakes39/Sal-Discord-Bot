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

    case "play":
      playfxn(msg, args);
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

function playfxn(msg, args) {
  switch (args[0]) {
    case "tictactoe":
      tictactoe(msg);
      break;
  }
}

function tictactoe(msg) {
  let grid = [
    ":regional_indicator_a:", ":regional_indicator_b:", ":regional_indicator_c:",
    ":regional_indicator_d:", ":regional_indicator_e:", ":regional_indicator_f:",
    ":regional_indicator_g:", ":regional_indicator_h:", ":regional_indicator_i:"
  ];
  let str = "";
  for (let i = 0; i < grid.length; i++) {
    (i % 3 == 2) ? (str += grid[i] + "\n") : (str += grid[i]);
  }
  const gameEmbed = new Discord.MessageEmbed()
    .setColor("#f89e4f")
    .setTitle(`TicTacToe:`)
    .setDescription(str)
    .addField("Enter The Letter to Put X or O in That Spot.", `Player: ${msg.author}`);
  msg.channel.send(gameEmbed);
}