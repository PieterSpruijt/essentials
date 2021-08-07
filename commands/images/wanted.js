const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');
const DIG = require("discord-image-generation");

module.exports = {
  name: "wanted",
  description: "wanted a member!",
  category: "images",
  usage: "`wanted [mention]`",
  run: async (bot, message, args, userinfo) => {
    let Embed2 = new MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} | You did not mention a user! | \`wanted [mention]\``)
        .setColor(userinfo.color);

    let avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
    let User = message.mentions.users.first();
    if (!User) return message.channel.send(Embed2);
    let UserAvatar = User.displayAvatarURL({ dynamic: false, format: 'png' });
    let img = await new DIG.Wanted().getImage(UserAvatar, `€`);
    let attach = new Discord.MessageAttachment(img, "wanted.png");;
    message.channel.send({files: [attach]})
  },
};
