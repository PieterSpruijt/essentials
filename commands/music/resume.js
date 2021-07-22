module.exports = {
  name: "resume",
  description: "Resume music!",
  category: "music",
  usage: "`resume`",
  run: async (bot, message, args) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('> You should join a voice channel before using this command!');
    let queue = message.client.queue.get(message.guild.id)
    if(!queue) return message.channel.send({
        embed: {
            description: '> There is nothing playing right now to resume!'
        }
    })
    if(queue.playing !== false)
    queue.connection.dispatcher.resume()
    message.react('▶')
    message.channel.send('> Resumed The music!')
  },
};

