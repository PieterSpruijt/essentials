const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  run: async (bot, interaction, userinfo) => {
    if (!userinfo.staff) return bot.error(`You Dont have Permission to do that!`, bot, interaction);
    let lyrics = null;
    const queue = bot.queue.get(interaction.guild.id);
    if (interaction.data.options[0]) {
      try {
        lyrics = await lyricsFinder(interaction.data.options[0].value, "");
        if (!lyrics) lyrics = `No lyrics found for ${interaction.data.options[0].value} :(`;
      } catch (error) {
        lyrics = `No lyrics found for ${interaction.data.options[0].value} :(`;
      }

      let lyricsEmbed = new MessageEmbed()
        .setTitle(`Lyrics For ${interaction.data.options[0].value}`)
        .setDescription(lyrics)
        .setColor(userinfo.color)
        .setTimestamp();

      if (lyricsEmbed.description.length >= 2048)
        lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
        return await interaction.editRely({embeds: [lyricsEmbed]});
    }
    if (!queue) return bot.error(`I can't find the lyrics!`, bot, interaction)


    try {
      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `No lyrics found for ${queue.songs[0].title} :(`;
    } catch (error) {
      lyrics = `No lyrics found for ${queue.songs[0].title} :(`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setTitle(`Lyrics For ${queue.songs[0].title}`)
      .setDescription(lyrics)
      .setColor(userinfo.color)
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
      await interaction.editRely({embeds: [lyricsEmbed]});
  },
};

