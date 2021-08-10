module.exports = {
  name: `stop`,
  description: `Stop the queue!`,
  private: false,
  run: async (bot, interaction) => {
    const channel = interaction.member.voice.channel;
    if (!channel) return bot.error(`You should join a voice channel before using this command!`, bot, interaction);
    let queue = bot.queue.get(interaction.guild.id)
    if (!queue) return bot.error(`There is nothing playing to be stopped!`, bot, interaction);
    queue.connection.destroy()
    bot.queue.delete(interaction.guild.id);
    await interaction.editReply(`Music stopped`);

  },
};

