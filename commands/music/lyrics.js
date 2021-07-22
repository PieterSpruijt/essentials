const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: "lyrics",
  description: "Get lyrics of now playing music!",
  category: "music",
  usage: "`lyrics [url/name]`",
  run: async (bot, message, args, userinfo) => {
    let lyrics = null;
    const queue = message.client.queue.get(message.guild.id);
    if (args.length) {
      try {
        lyrics = await lyricsFinder(args, "");
        if (!lyrics) lyrics = `No lyrics found for ${args} :(`;
      } catch (error) {
        lyrics = `No lyrics found for ${args} :(`;
      }
  
      let lyricsEmbed = new MessageEmbed()
        .setTitle(`Lyrics For ${args}`)
        .setDescription(lyrics)
        .setColor(userinfo.color)
        .setTimestamp();
  
      if (lyricsEmbed.description.length >= 2048)
        lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
      return message.channel.send(lyricsEmbed).catch(console.error);
    }
    if (!queue) return message.channel.send(`I can't find the lyrics!`);


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
    return message.channel.send(lyricsEmbed);
  },
};

