const { MessageEmbed } = require("discord.js");

module.exports = {
  name: `loop`,
  description: `Disable/enable loop!`,
  private: false,
  run: async (bot, interaction, userinfo) => {
    const serverQueue = bot.queue.get(interaction.guild.id);
    if (serverQueue) {
      serverQueue.loop = !serverQueue.loop;
      await interaction.editRely({embeds: [{
              description: `🔁  **|**  Loop is **\`${serverQueue.loop === true ? "enabled" : "disabled"}\`**`
            }]});
      return bot.queue.set(interaction.guild.id, serverQueue)
    };
    return bot.error("There is nothing playing in this server.", bot, interaction);
  },
};

