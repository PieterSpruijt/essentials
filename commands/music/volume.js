
module.exports = {
  name: `volume`,
  description: `Set the volume of the music music!`,
  private: false,
  commandOptions: [
    {
      type: 10,
      name: "number",
      description: "Volume to set to",
      required: false
    }
  ],
  run: async (bot, interaction, userinfo) => {
    const channel = interaction.member.voice.channel;
    if (!channel) return bot.error('You should join a voice channel before using this command!', bot, interaction);

    let queue = bot.queue.get(interaction.guild.id)

    if (!interaction.data.options[0]) return await interaction.editRely({
      flags: 64,
      content: 'The current volume is set to: ' + queue.volume
    });

    if (interaction.data.options[0].value > 100) return bot.error(`100 is the max volume!`, bot, interaction)
    queue.songs[0].resource.volume.setVolume(interaction.data.options[0].value / 5);
    queue.volume = interaction.data.options[0].value
    await interaction.editRely({ content: 'Volume is set to ' + interaction.data.options[0].value });
  },
};

