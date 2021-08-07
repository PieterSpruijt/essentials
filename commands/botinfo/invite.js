const Discord = require('discord.js');

module.exports = {
  name: "invite",
  description: "Make a invite for this server",
  category: "botinfo",
  run: async (bot, interaction, userinfo) => {
    let Embed = new Discord.MessageEmbed()
        .setTitle(`Invite Essentials!`)
        .setAuthor(bot.config.botName, bot.config.embeds.footer_photo, bot.config.website)
        .setThumbnail(bot.config.embeds.footer_photo)
        .setDescription(bot.config.botInvite)
        .setFooter(bot.config.embeds.footer_name, bot.config.embeds.footer_photo)
        .setColor(userinfo.color);
    interaction.editReply({embeds: [Embed]});
  },
};
