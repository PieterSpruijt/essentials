const { AudioPlayerStatus, createAudioResource, createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel, StreamType, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord');

module.exports = {
  run: async (bot, interaction, userinfo) => {


    const queue = bot.queue.get(interaction.guild.id);
    if (!queue) return bot.error("There is no queue.", bot, interaction);
    if (interaction.data.options[0].value > queue.songs.length)
      return bot.error(`The queue is only ${queue.songs.length} songs long!`, bot, interaction);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < interaction.data.options[0].value - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(interaction.data.options[0].value - 2);
    }
    try {
      const resource = createAudioResource(await ytdl(`https://www.youtube.com/watch?v=${queue.songs[0].id}`), { inputType: StreamType.Opus, inlineVolume: true });
      resource.volume.setVolume(queue.volume / 5)
      queue.songs[0].resource = resource
      queue.player.play(resource)
    } catch (error) {
      console.log(error)
      queue.connection.destroy()
      bot.queue.delete(interaction.guild.id);
      await interaction.editRely({content: `No songs left, ended queue`});
    }

    await interaction.editRely({content: `${interaction.member.user.tag} ⏭ skipped \`${interaction.data.options[0].value - 1}\` songs`});
  },
};

