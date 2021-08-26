const { AudioPlayerStatus, createAudioResource, createAudioPlayer, NoSubscriberBehavior, joinVoiceChannel, StreamType, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord');

module.exports = {
  name: "skipto",
  description: "Skip to music",
  category: "music",
  aliases: ["st"],
  usage: "`skipto [url/name]`",
  run: async (bot, message, args, userinfo) => {
    if (!args.length || isNaN(args[0]))
      return message.channel.send(`you did not specify an number in the queue`);


    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return bot.error("There is no queue.",message.channel);
    if (args[0] > queue.songs.length)
      return bot.error(`The queue is only ${queue.songs.length} songs long!`,message.channel);

    queue.playing = true;

    if (queue.loop) {
      for (let i = 0; i < args[0] - 2; i++) {
        queue.songs.push(queue.songs.shift());
      }
    } else {
      queue.songs = queue.songs.slice(args[0] - 2);
    }
     try{
      const resource = createAudioResource(await ytdl(`https://www.youtube.com/watch?v=${queue.songs[0].id}`), { inputType: StreamType.Opus, inlineVolume: true });
      resource.volume.setVolume(queue.volume / 5)
      queue.songs[0].resource = resource
      queue.player.play(resource)    
      }catch (error) {
        console.log(error)
        queue.connection.destroy()
      message.client.queue.delete(message.guild.id);
      bot.success(`Error: ended queue`, message.channel);
      }
    
    bot.success(`${message.author} ⏭ skipped \`${args[0] - 1}\` songs`, queue.textChannel);
  },
};

