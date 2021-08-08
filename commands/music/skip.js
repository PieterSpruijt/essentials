const { AudioPlayerStatus, createAudioResource, createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel, StreamType, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord');

module.exports = {
  run: async (bot, interaction, userinfo) => {
    const channel = interaction.member.voice.channel;
    if (!channel) return bot.error('You should join a voice channel before using this command!', bot, interaction);
    let queue = bot.queue.get(interaction.guild.id)
    if(!queue) return bot.error(`There is nothing in the queue right now!`, bot, interaction);

    if(!queue.songs[0]) {
      queue.connection.destroy()
      bot.queue.delete(interaction.guild.id);
      await interaction.editRely({content: `No songs left, ended queue`});
    } else {
      queue.songs.shift()
      const resource = createAudioResource(await ytdl(`https://www.youtube.com/watch?v=${queue.songs[0].id}`), { inputType: StreamType.Opus, inlineVolume: true });
      resource.volume.setVolume(queue.volume / 5)
      queue.songs[0].resource = resource
      queue.player.play(resource)
    }
  },
};

