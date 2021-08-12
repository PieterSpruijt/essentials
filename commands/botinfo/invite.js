const Discord = require('discord.js');

module.exports = {
  name: "invite",
  description: "Make a invite for this server",
  category: "botinfo",
  private: false,
  run: async (bot, interaction, userinfo) => {
    const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setLabel(`Invite`)
                    .setStyle(`LINK`)
                    .setURL(global.bot.config.botInvite)
            )
    await interaction.editReply({content: `[click to invite me!](<${global.bot.config.botInvite}>)`, components: [row]});
  },
};
