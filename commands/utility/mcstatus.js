const { MessageEmbed } = require("discord.js");
const status = require('minecraft-server-status');
module.exports = {
  name: "mcstatus",
  description: "Get status of mc server!",
  private: false,
  commandOptions: [
    {
      type: 3,
      name: `ip`,
      description: `Minecraft server ip`,
      required: true
    }
  ],
  run: async (bot, interaction, userinfo) => {
    status(interaction.data.options[0].value, 25565, async (response) => {
      if (response.players.max == 0) return bot.error(`You did not specify a ip!`, bot, interaction);
      let Embed = new MessageEmbed();
      Embed.setColor(userinfo.color)
      Embed.setTitle(interaction.data.options[0].value)
      Embed.setDescription('____________________________')
      Embed.setThumbnail(`https://eu.mc-api.net/v3/server/favicon/${interaction.data.options[0].value}`)
      Embed.addField(`Online:`, response.online ? `Online` : `Offline`)
      Embed.addField(`Players online:`, `${response.players.now}/${response.players.max}`)
      await interaction.editReply({ embeds: [Embed] });
    })
  },
};
