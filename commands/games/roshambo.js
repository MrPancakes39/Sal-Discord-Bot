const Discord = require("discord.js");

module.exports = function (msg) {
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