const { MessageEmbed } = require('discord.js')

module.exports = {
  name: "queue",
  description: "get music queue!",
  category: "music",
  usage: "`queue`",
  run: async (bot, message, args, userinfo) => {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('> You should join a voice channel before using this command!');
    const queue = message.client.queue.get(message.guild.id)
    let status;
    if(!queue) status = '> There is nothing in queue!'
    else status = queue.songs.map((t, i) => `\`${++i}.\` | [\`${t.title}\`](https://youtube.com/watch?v=${t.id}) - [<@${t.req.id}>]`);
    if(!queue) np = status
    else np = `[${queue.songs[0].title}](https://youtube.com/watch?v=${queue.songs[0].id}) - [<@${queue.songs[0].req.id}>]`
    if(queue) thumbnail = queue.songs[0].thumbnail
    else thumbnail = message.guild.iconURL()
    let embed = new MessageEmbed()
    .setTitle('Queue')
    .setThumbnail(thumbnail)
    .setColor(userinfo.color)
    .addField(`Now playing`, np, false)
    .addField('Queue', status, false)
    .addField("Text Channel", queue.textChannel, true)
    .addField("Voice Channel", queue.voiceChannel, true)
    .setFooter(`Currently Server Volume is ${queue.volume}/100`);
    message.channel.send(embed)
  },
};

