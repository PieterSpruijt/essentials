const { AudioPlayerStatus, createAudioResource, createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel, StreamType, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord');

module.exports = {
  name: "skip",
  description: "Skip music!",
  category: "music",
  usage: "`skip`",
  run: async (bot, message, args, userinfo) => {
    const channel = message.member.voice.channel;
    if (!channel) return bot.error('You should join a voice channel before using this command!', message.channel);
    let queue = message.client.queue.get(message.guild.id)
    if(!queue) return bot.error(`There is nothing in the queue right now!`, message.channel);

    if(!queue.songs[0]) {
      queue.connection.destroy()
      message.client.queue.delete(message.guild.id);
      bot.success(`No songs left, ended queue`, message.channel);
    } else {
      queue.songs.shift()
      const resource = createAudioResource(await ytdl(`https://www.youtube.com/watch?v=${queue.songs[0].id}`), { inputType: StreamType.Opus, inlineVolume: true });
      resource.volume.setVolume(queue.volume / 5)
      queue.songs[0].resource = resource
      queue.player.play(resource)
    }
  },
};

