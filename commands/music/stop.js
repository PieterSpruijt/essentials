module.exports = {
  name: "stop",
  description: "Stop the music!",
  category: "music",
  usage: "`stop`",
  run: async (bot, message, args) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('You should join a voice channel before using this command!');
    let queue = message.client.queue.get(message.guild.id)
    if(!queue) return message.channel.send({
        embed: {
            description: 'There is nothing playing to be stopped!',
            color: userinfo.color
        }
    })
    queue.songs = []
    queue.connection.dispatcher.end('Stopped!')
  },
};

