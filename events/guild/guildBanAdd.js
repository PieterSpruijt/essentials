const { MessageEmbed } = require("discord.js");
const logchannel = require("../../models/logchannel");
module.exports = async (bot, guild, user) => {
  try {
      var embed = new MessageEmbed()
                .setAuthor(`Member banned`, `${user.avatarURL({ size: 4096 })}`)
                .setDescription(`${user} - ${user.tag} (${user.id})`)
                .setThumbnail(user.avatarURL({ size: 4096 }))
                .setTimestamp()
                .setColor("BLUE")

    var storedSettings = await logchannel.findOne({ gid: guild.id });
    if (!guild.channels.cache.get(storedSettings.logchannel)) return;
    guild.channels.cache.get(storedSettings.logchannel).send({embeds: [embed]})
  } catch (e) {}
};
