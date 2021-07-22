module.exports = {
  name: "shuffle",
  description: "Shuffle music!",
  category: "music",
  usage: "`shuffle`",
  run: async (bot, message, args) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('> You should join a voice channel before using this command!');
    const queue = message.client.queue.get(message.guild.id)
    if(!queue) return bot.error('There are no songs in queue to shuffle', message.channel)
    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    bot.success(`Shuffled the current queue 🔀`, message.channel);
  },
};

