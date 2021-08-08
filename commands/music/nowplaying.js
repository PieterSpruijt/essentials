const { MessageEmbed } = require("discord.js");
module.exports = {
  run: async (bot, interaction, userinfo) => {
    if (!userinfo.staff) return bot.error(`You Dont have Permission to do that!`, bot, interaction);
    const serverQueue = bot.queue.get(interaction.guild.id);
    if (!serverQueue) return bot.error("There is nothing playing in this server.", bot, interaction);
    let song = serverQueue.songs[0]
    let thing = new MessageEmbed()
      .setAuthor("Now Playing")
      .setThumbnail(song.img)
      .setColor(userinfo.color)
      .addField("Name", song.title, true)
      .addField("Duration", `${song.duration}s`, true)
      .addField("Requested by", song.req.tag, true)
      .setFooter(`Views: ${song.views}`);
      await interaction.editRely({embeds: [thing]});
  },
};

