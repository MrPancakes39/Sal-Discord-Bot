const fetch = require("node-fetch");
const Discord = require("discord.js");

module.exports = async function (msg, args, cmd) {
    let post = await randomPick(cmd);
    const redditEmbed = new Discord.MessageEmbed()
        .setColor("#f89e4f")
        .setTitle(post.data.title)
        .setDescription(`Posted by: ${post.data.author}`)
        .setImage(post.data.url)
        .addField("Other info:", `Up votes: ${post.data.ups} / Comments: ${post.data.num_comments}`)
        .setFooter(`Fetched from r/${cmd}`)
        .setTimestamp();
    msg.channel.send(redditEmbed);
}

async function randomPick(cmd) {
    let choices = await getJSON(cmd);
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

async function getJSON(subreddit) {
    let res = await fetch(`https://www.reddit.com/r/${subreddit}.json?sort=top&t=week&limit=800`);
    let data = await res.json();
    const safe = data["data"]["children"].filter(post => !post.data.over_18);
    return safe;
}