module.exports = {
  name: `pause`,
  description: `Pause music!`,
  private: false,
  run: async (bot, interaction, userinfo) => {
    const channel = interaction.member.voice.channel;
    if (!channel) return bot.error(`You should join a voice channel before using this command!`, bot, interaction);
    let queue = bot.queue.get(interaction.guild.id)
    if(!queue) return bot.error(`There is nothing playing right now to pause!`, bot, interaction)
    if(queue.playing !== false)
    queue.player.pause()
    await interaction.editRely({content: `Paused the music!`});
  },
};

