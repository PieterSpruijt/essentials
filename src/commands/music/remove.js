module.exports = {
  name: `remove`,
  description: `Remove music from queue!`,
  private: false,
  commandOptions: [
    {
      type: 10,
      name: "number",
      description: "Number in queue to remove",
      required: true
    },
  ],
  run: async (bot, interaction) => {
    const queue = bot.queue.get(interaction.guild.id);
    if (!queue) return bot.error("There is no queue.", bot, interaction);
    if (queue.songs.length == 1) return bot.error("There is no queue.", bot, interaction);
    if (interaction.data.options[0].value > queue.songs.length)
      return bot.error(`The queue is only ${queue.songs.length} songs long!`, bot, interaction);

    const song = queue.songs.splice(interaction.data.options[0].value - 1, 1);
    await interaction.editRely({content: `❌ **|** Removed: **\`${song[0].title}\`** from the queue.`});
  },
};

