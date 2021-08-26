const { MessageEmbed } = require("discord.js");
const logchannel = require("../../models/logchannel");
module.exports = async (bot, emoji) => {
  try {
      var embed = new MessageEmbed()
                .setTitle(`Emoji created`)
                .setDescription(`**Emoji Info** - ${emoji.name} (${emoji.id})
            **Emoji** - ${emoji}`)
                .setTimestamp()
                .setTimestamp()
                .setColor("BLUE")

    var storedSettings = await logchannel.findOne({ gid: emoji.guild.id });
    if (!emoji.guild.channels.cache.get(storedSettings.logchannel)) return;
    emoji.guild.channels.cache.get(storedSettings.logchannel).send({embeds: [embed]})
  } catch (e) {}
};
