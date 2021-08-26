module.exports = {
  name: "pause",
  description: "Pause music!",
  category: "music",
  usage: "`pause`",
  run: async (bot, message, args) => {
    const channel = message.member.voice.channel;
    if (!channel) return bot.error(`You should join a voice channel before using this command!`, message.channel);
    let queue = message.client.queue.get(message.guild.id)
    if(!queue) return bot.error(`There is nothing playing right now to pause!`, message.channel)
    if(queue.playing !== false)
    queue.player.pause()
    bot.success(`Paused the music!`, message.channel);
  },
};

