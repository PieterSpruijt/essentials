const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "nuke",
  description: "Nuke a channel",
  aliases: ["clearchannel"],
  category: "moderation",
  usage: "nuke ",
  run: async (bot, message, args, userinfo) => {
    if (!message.channel.permissionsFor(message.guild.me).has(bot.perms.MANAGE_CHANNELS)) return message.channel.send({embed: {description: `${bot.info.emojis.normal.cross} | I Dont have Permsission to do that!`, color: `RED`}});
    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR))
    return message.channel.send(`${bot.info.emojis.normal.cross} | You Dont have Permsission to do that!`);
      message.channel.clone().then((channel2) => {
          channel2.setPosition(message.channel.position).then(
            message.channel.delete()
          )
        let Embed = new MessageEmbed()
        .setImage(`https://i.imgur.com/Da7ScU4.gif`)
        .setTitle(`Channel Nuked by **${message.author.tag}**`)
        .setColor(`RED`)
        channel2.send({embeds: [Embed]});
        })   
    
  },
};
