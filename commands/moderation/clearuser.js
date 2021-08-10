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
    }
  ],
  run: async (bot, interaction) => {
    if (!interaction.member.permissions.has(bot.perms.MANAGE_MESSAGES))
      return bot.error(`You Dont have Permsission to do that you can do \`report [tag user] [reason]\` of you want to report someone!`, bot, interaction);
    let user = interaction.data.options[0].user;
    interaction.guild.channels.cache.forEach(async (channel) => {
      if (channel.messages) {
        let messages = await channel.messages.fetch();
        let userMessages = messages.filter((m) => m.author.id === user.id);
        await channel.bulkDelete(userMessages).catch(() => { });
      }

    });
    await interaction.editReply(`Cleared all recent messages of **${user.tag}**`);

  },
};
