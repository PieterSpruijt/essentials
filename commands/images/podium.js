const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');
const DIG = require("discord-image-generation");

module.exports = {
  name: "podium",
  description: "make a podium!",
  category: "images",
  usage: "`podium [id1] [id2] [id3]`",
  run: async (bot, message, args, userinfo) => {
    let Embed2 = new MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} | You did not mention a user! | \`podium [id1] [id2] [id3]\``)
        .setColor(userinfo.color);
    let User1 = bot.users.cache.get(args[0]);
    let User2 = bot.users.cache.get(args[1]);
    let User3 = bot.users.cache.get(args[2]);
    if (!User1 || !User2 || !User3) return message.channel.send(Embed2);

    
    let User1Avatar = User1.displayAvatarURL({ dynamic: false, format: 'png' });
    let User2Avatar = User2.displayAvatarURL({ dynamic: false, format: 'png' });
    let User3Avatar = User3.displayAvatarURL({ dynamic: false, format: 'png' });



    let img = await new DIG.Podium().getImage(User1Avatar, User2Avatar, User3Avatar, User1.tag, User2.tag, User3.tag);
    let attach = new Discord.MessageAttachment(img, "podium.png");;
    message.channel.send({files: [attach]})
  },
};
