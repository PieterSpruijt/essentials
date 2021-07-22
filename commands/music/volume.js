
module.exports = {
  name: "volume",
  description: "Set the volume of the music music!",
  category: "music",
  usage: "`volume <number>`",
  run: async (bot, message, args) => {
    const channel = message.member.voice.channel;
    if (!channel) return bot.error('You should join a voice channel before using this command!', message.channel);

    let queue = message.client.queue.get(message.guild.id)

    if(!args[0]) return bot.error('The current volume is set to: ' + queue.volume, message.channel);

    if(args[0] > 100) return bot.error(`100 is the max volume!`, message.channel)
    queue.songs[0].resource.volume.setVolume(args[0] / 5);
    queue.volume = args[0]
    bot.success('Volume is set to ' + args[0], message.channel);
  },
};

