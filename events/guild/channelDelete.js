const { MessageEmbed } = require("discord.js");
const logchannel = require("../../models/logchannel");
module.exports = async (channel) => {
  try {
    let types = {
                text: 'Text channel',
                voice: 'Voice channel',
                category: 'Category',
                null: 'None',
            };

            var embed = new MessageEmbed()
                .setTitle(`Channel deleted`)
                .setDescription(`**Channel Info** - ${channel.name} (${channel.id})
                    **Type** - ${types[channel.type]}`)
                .setTimestamp()
                .setColor(`BLUE`)  

    var storedSettings = await logchannel.findOne({ gid: channel.guild.id });
    if (!channel.guild.channels.cache.get(storedSettings.logchannel)) return;
    channel.guild.channels.cache.get(storedSettings.logchannel).send(embed)
  } catch (e) {}
};
