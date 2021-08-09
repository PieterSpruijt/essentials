module.exports = {
  name: `shuffle`,
  description: `Shuffle the queue!`,
  private: false,
  run: async (bot, interaction, userinfo) => {
    const channel = interaction.member.voice.channel;
    if (!channel) return bot.error(`You should join a voice channel before using this command!`, bot, interaction)
    const queue = bot.queue.get(interaction.guild.id)
    if (!queue) return bot.error('There are no songs in queue to shuffle', bot, interaction)
    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    await interaction.editRely({content: `Shuffled the current queue 🔀`});
  },
};

