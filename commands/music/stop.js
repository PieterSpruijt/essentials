module.exports = {
  name: "stop",
  description: "Stop the music!",
  category: "music",
  aliases: ['leave'],
  usage: "`stop`",
  run: async (bot, message, args) => {
    const channel = message.member.voice.channel;
    if (!channel) return bot.error(`You should join a voice channel before using this command!`, message.channel);
    let queue = message.client.queue.get(message.guild.id)
    if (!queue) return bot.error(`There is nothing playing to be stopped!`, message.channel);
    queue.connection.destroy()
    message.client.queue.delete(message.guild.id);
    bot.success(`Stopped music!`, message.channel);

  },
};

