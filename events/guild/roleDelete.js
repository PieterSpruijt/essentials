const { MessageEmbed } = require("discord.js");
const logchannel = require("../../models/logchannel");
module.exports = async (bot, role) => {
  try {
      var embed = new MessageEmbed()
                .setTitle(`Role deleted`)
                .setDescription(`**Role Info** - ${role.name} (${role.id})`)
                .setTimestamp()
                .setTimestamp()
                .setColor("BLUE")

    var storedSettings = await logchannel.findOne({ gid: role.guild.id });
    if (!role.guild.channels.cache.get(storedSettings.logchannel)) return;
    role.guild.channels.cache.get(storedSettings.logchannel).send({embeds: [embed]})
  } catch (e) {
    //error
  }
};
