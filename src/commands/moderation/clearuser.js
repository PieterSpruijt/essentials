module.exports = {
  name: "clearuser",
  description: "Clear user's messages in a channel",
  private: true,
  commandOptions: [
    {
      type: 6,
      name: "user",
      description: "The user to clear",
      required: true
    },
    {
      type: 3,
      name: "userid",
      description: "use a userid instead",
      required: false
    }
  ],
  run: async (bot, interaction) => {
    if (!interaction.member.permissions.has(bot.perms.MANAGE_MESSAGES))
      return bot.error(`You Dont have Permsission to do that you can do \`report [tag user] [reason]\` of you want to report someone!`, bot, interaction);
    if (interaction.data.options[1]) {
      let id = interaction.data.options[1].value;
      await interaction.guilds.channels.fetch();
      interaction.guild.channels.cache.forEach(async (channel) => {
        if (channel.messages) {
          let messages = await channel.messages.fetch();
          let userMessages = messages.filter((m) => m.author.id === id);
          await channel.bulkDelete(userMessages).catch(() => {/* stuff */ });
        }

      });
      await interaction.editReply(`Cleared all recent messages of **${id}**`);
    } else {
      let user = interaction.data.options[0].user;
      await interaction.guilds.channels.fetch();
      interaction.guild.channels.cache.forEach(async (channel) => {
        if (channel.messages) {
          let messages = await channel.messages.fetch();
          let userMessages = messages.filter((m) => m.author.id === user.id);
          await channel.bulkDelete(userMessages).catch(() => { });
        }

      });
      await interaction.editReply(`Cleared all recent messages of **${user.tag}**`);
    }


  },
};
