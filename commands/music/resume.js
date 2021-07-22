module.exports = {
  name: "resume",
  description: "Resume music!",
  category: "music",
  usage: "`resume`",
  run: async (bot, message, args) => {
    const channel = message.member.voice.channel;
    if (!channel) return bot.error(`You should join a voice channel before using this command!`, message.channel);
    let queue = message.client.queue.get(message.guild.id)
    if(!queue) return bot.error(`There is nothing playing right now to resume!`, message.channel)
    if(queue.playing !== false)
    queue.player.unpause()
    bot.success(`Resumed the music!`, message.channel);
  },
};

