const { MessageEmbed } = require("discord.js");
const logchannel = require("../../models/logchannel");
module.exports = async (guild, user) => {
  try {
      var embed = new MessageEmbed()
                .setAuthor(`Member unbanned`, `${user.avatarURL({ size: 4096 })}`)
                .setDescription(`${user} - ${user.tag} (${user.id})`)
                .setThumbnail(user.avatarURL({ size: 4096 }))
                .setTimestamp()
                .setColor("BLUE")

    var storedSettings = await logchannel.findOne({ gid: guild.id });
    if (!guild.channels.cache.get(storedSettings.logchannel)) return;
    guild.channels.cache.get(storedSettings.logchannel).send(embed)
  } catch (e) {}
};
