const Canvas = require("canvas");
const Discord = require("discord.js");

module.exports = async function (msg, args) {
    if (args.length == 0) {
        msg.channel.send("You must tell me what to cry about...");
    } else {
        const reason = args.join(" ");
        const canvas = Canvas.createCanvas(440, 600);
        const ctx = canvas.getContext("2d");

        const background = await Canvas.loadImage(__dirname + "/../sad.jpeg");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = "#333333";
        ctx.textAlign = "center";
        ctx.lineWidth = 7;
        ctx.font = "26px sans-serif";

        ctx.strokeText("Why are you crying?", canvas.width / 2, 200);
        ctx.strokeText(reason, canvas.width / 2, 408);
        ctx.strokeText("It's okay, here's a hug <3", canvas.width / 2, 592);

        ctx.fillText("Why are you crying?", canvas.width / 2, 200);
        ctx.fillText(reason, canvas.width / 2, 408);
        ctx.fillText("It's okay, here's a hug <3", canvas.width / 2, 592);

        const stream = canvas.createJPEGStream({
            quality: 0.80,
            chromaSubsampling: false
        })
        const attachment = new Discord.MessageAttachment(stream, "you-cry.jpg");
        msg.channel.send("", attachment);
    }
}