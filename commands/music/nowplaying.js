const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "nowplaying",
  description: "Get current song!",
  category: "music",
  aliases: ["np"],
  usage: "`nowplaying`",
  run: async (bot, message, args, userinfo) => {
    if (!userinfo.staff) return bot.error(`You Dont have Permission to do that!`, message.channel);
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return bot.error("There is nothing playing in this server.", message.channel);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .setAuthor("Now Playing")
      .setThumbnail(song.img)
      .setColor(userinfo.color)
      .addField("Name", song.title, true)
      .addField("Duration", `${song.duration}s`, true)
      .addField("Requested by", song.req.tag, true)
      .setFooter(`Views: ${song.views}`)
    return message.channel.send({embeds: [thing]})
  },
};

