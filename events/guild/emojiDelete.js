const { MessageEmbed } = require("discord.js");
const logchannel = require("../../models/logchannel");
module.exports = async (emoji) => {
  try {
    var embed = new MessageEmbed()
                .setTitle(`Emoji deleted`)
                .setDescription(`**Emoji Info** - ${emoji.name} (${emoji.id})`)
                .setTimestamp()
                .setTimestamp()
                .setColor("BLUE")  

    var storedSettings = await logchannel.findOne({ gid: emoji.guild.id });
    if (!emoji.guild.channels.cache.get(storedSettings.logchannel)) return;
    emoji.guild.channels.cache.get(storedSettings.logchannel).send({embeds: [embed]})
  } catch (e) {}
};
