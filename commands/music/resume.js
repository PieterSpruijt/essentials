module.exports = {
  name: `resume`,
  description: `Resume music!`,
  private: false,
  run: async (bot, interaction, userinfo) => {
    const channel = interaction.member.voice.channel;
    if (!channel) return bot.error(`You should join a voice channel before using this command!`, bot, interaction);
    let queue = bot.queue.get(interaction.guild.id)
    if(!queue) return bot.error(`There is nothing playing right now to resume!`, bot, interaction)
    if(queue.playing !== false)
    queue.player.unpause()
    await interaction.editRely({content: `Resumed the music!`});
  },
};

