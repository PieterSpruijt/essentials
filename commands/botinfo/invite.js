const Discord = require('discord.js');

module.exports = {
  name: "invite",
  description: "Make a invite for this server",
  category: "botinfo",
  usage: "`invite`",
  run: async (bot, message, args, userinfo) => {
    let Embed = new Discord.MessageEmbed()
        .setTitle(`Invite Essentials!`)
        .setAuthor(bot.info.embed.Botname, bot.info.embed.profielfoto, bot.info.embed.website)
        .setThumbnail(bot.info.embed.profielfoto)
        .setDescription(bot.config.inviteurl)
        .setFooter(bot.info.embed.footer_name, bot.info.embed.footer_foto)
        .setColor(userinfo.color);
    message.channel.send(Embed);
  },
};
