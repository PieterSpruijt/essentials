const { MessageEmbed } = require("discord.js");
const logchannel = require("../../models/logchannel");
module.exports = async (bot, role) => {
  try {
      var embed = new MessageEmbed()
                .setTitle(`Role created`)
                .setDescription(`**Role Info** - ${role.name} (${role.id})
                **Role** - <@&${role.id}>`)
                .setTimestamp()
                .setTimestamp()
                .setColor(`BLUE`)

    var storedSettings = await logchannel.findOne({ gid: role.guild.id });
    if (!storedSettings) return;
    if (!role.guild.channels.cache.get(storedSettings.logchannel)) return;
    role.guild.channels.cache.get(storedSettings.logchannel).send({embeds: [embed]})
  } catch (e) {
    //error
  }
};
