const Discord = require('discord.js');

module.exports = {
  name: "eval",
  description: "Evaluate code",
  category: "developer",
  private: false,
  developer: true,
  commandOptions: [
    {
      type: 3,
      name: `code`,
      description: `Code to evaluate`,
      required: true
    }
  ],
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
