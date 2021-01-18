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

    case "emoji":
      msg.channel.send("<a:trombone:394038815611682836>");
      break;

    case "play":
      if (args.length == 0) {
        msg.channel.send("You must enter a game too e.g. `sal play roshambo`.");
      } else if (args.length == 1) {
        playfxn(msg, args);
      } else {
        msg.reply("Sorry but I only accept 1 game not multiple lol.");
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

function playfxn(msg, args) {
  switch (args[0]) {
    case "roshambo":
      roshambo(msg);
      break;

    case "tictactoe":
      tictactoe(msg);
      break;
  }
}

function roshambo(msg) {
  let answers = ["r", "p", "s", "rock", "paper", "scissors"];
  const filter = res => {
    let answers_match = answers.some(answer => answer.toLowerCase() === res.content.toLowerCase());
    let authors_match = res.author.id === msg.author.id;
    return answers_match && authors_match;
  };
  msg.channel.send("Choose either (r)ock, (p)aper, or (s)cissors").then(() => {
    msg.channel.awaitMessages(filter, {
        max: 1,
        time: 15000,
        errors: ["time"]
      })
      .then(collected => {
        let choices = ["rock", "paper", "scissors"];
        let bot_choice = choices[Math.floor(Math.random() * (choices.length))];
        let usr_choice = collected.first().content.toLowerCase();

        let result =
          ((usr_choice.charAt(0) == "r" && bot_choice.charAt(0) == "s") || (usr_choice.charAt(0) == "p" && bot_choice.charAt(0) == "r") || (usr_choice.charAt(0) == "s" && bot_choice.charAt(0) == "p")) ? "won" :
          (usr_choice.charAt(0) == bot_choice.charAt(0)) ? "tie" :
          "lost";
        let color =
          (result == "won") ? "#05fb07" :
          (result == "tie") ? "#fefe4f" :
          "#fa5253";
        let title = (result == "tie") ? "It was a tie..." : `You ${result}!`;
        let str =
          (result == "won") ? `Congratulation ${collected.first().author}!` :
          (result == "tie") ? "Tie... Hmmmmm :/" :
          "Well too bad :p";

        usr_choice =
          (usr_choice.charAt(0) == "r") ? "rock" :
          (usr_choice.charAt(0) == "p") ? "paper" :
          "scissors";

        const gameEmbed = new Discord.MessageEmbed()
          .setColor(color)
          .setTitle(title)
          .setDescription(`I chose ${bot_choice} while you chose ${usr_choice}\n` + str);

        msg.channel.send(gameEmbed).then(sentEmbed => {
          if (result == "won") {
            sentEmbed.react("🎉");
          } else if (result == "tie") {
            sentEmbed.react("😑");
          } else {
            sentEmbed.react("😔");
          }
        });
      })
      .catch(collected => {
        msg.channel.send("Looks like you didn't pick anything.");
      });
  });
}

function tictactoe(msg) {
  let grid = [
    ":regional_indicator_a:", ":regional_indicator_b:", ":regional_indicator_c:",
    ":regional_indicator_d:", ":regional_indicator_e:", ":regional_indicator_f:",
    ":regional_indicator_g:", ":regional_indicator_h:", ":regional_indicator_i:"
  ];
  let str = gridToStr(grid);
  let gameEmbed = new Discord.MessageEmbed()
    .setColor("#f89e4f")
    .setTitle(`TicTacToe:`)
    .setDescription(str)
    .addField("Enter The Letter to Put X or O in That Spot.", `Player: ${msg.author}`);
  msg.channel.send(gameEmbed).then(sentEmbed => {
    // Add reactions.
    const emojiList = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮"];
    try {
      for (let emoji of emojiList) sentEmbed.react(emoji);
    } catch (error) {
      console.error("One of the emojis failed to react.");
    }

    const filter = (reaction, user) => {
      let reactions_match = emojiList.some(emoji => emoji === reaction.emoji.name);
      let authors_match = user.id === msg.author.id;
      return reactions_match && authors_match;
    };

    const dict = {
      "🇦": ":regional_indicator_a:",
      "🇧": ":regional_indicator_b:",
      "🇨": ":regional_indicator_c:",
      "🇩": ":regional_indicator_d:",
      "🇪": ":regional_indicator_e:",
      "🇫": ":regional_indicator_f:",
      "🇬": ":regional_indicator_g:",
      "🇭": ":regional_indicator_h:",
      "🇮": ":regional_indicator_i:"
    }

    sentEmbed.awaitReactions(filter, {
        max: 1,
        time: 60000,
        errors: ["time"]
      })
      .then(collected => {
        let emoji = collected.first().emoji.name;
        let index_of_letter = grid.indexOf(dict[emoji]);
        grid[index_of_letter] = ":x:";

        let choice = ":o:";
        while (choice == ":x:" || choice == ":o:") {
          choice = grid[Math.floor(Math.random() * (grid.length))];
        }
        index_of_letter = grid.indexOf(choice);
        grid[index_of_letter] = ":o:";

        str = gridToStr(grid);
        gameEmbed.setDescription(str);
        sentEmbed.edit(gameEmbed);
      })
      .catch(collected => {
        msg.channel.send(`After a minute, player: ${msg.author} didn't react.`);
      });
  })
}

function gridToStr(grid) {
  let str = "";
  for (let i = 0; i < grid.length; i++) {
    (i % 3 == 2) ? (str += grid[i] + "\n") : (str += grid[i]);
  }
  return str;
}

function checkWinner(grid) {
  // Check Columns.
  for (let i = 1; i < 8; i += 3) {
    if (grid[i - 1] == grid[i] && grid[i + 1] == grid[i + 1]) return true;
  }
  // Check Rows.
  for (let i = 3; i < 6; i++) {
    if (grid[i - 3] == grid[i] && grid[i] == grid[i + 3]) return true;
  }
  // Check Diagonals.
  if (grid[0] == grid[4] && grid[4] == grid[8]) return true;
  if (grid[2] == grid[4] && grid[4] == grid[6]) return true;
  // Else
  return false;
}