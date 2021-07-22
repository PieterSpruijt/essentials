const { MessageEmbed } = require("discord.js");
const logchannel = require("../../models/logchannel");
module.exports = async (oldChannel, newChannel) => {
  try {
      let guildsChannel = newChannel.guild;
            if (!guildsChannel || !guildsChannel.available) return;

            let types = {
                text: 'Text channel',
                voice: 'Voice channel',
                category: 'Category',
                null: 'None',
            };

            if (oldChannel.name !== newChannel.name) {
                var embed = new MessageEmbed()
                    .setTitle(`Channel adjusted!`)
                    .setDescription(`**Old channel** - ${oldChannel.name} (${oldChannel.id})
                **New channel** - ${newChannel.name} (${newChannel.id})
                **Type** - ${types[newChannel.type]}`)
                    .setTimestamp()
                    .setColor("#ff0000")

                try {
                    client.channels.cache.get(data.Channel).send(embed);
                }
                catch { }
            }

    var storedSettings = await logchannel.findOne({ gid: newChannel.guild.id });
    if (!newChannel.guild.channels.cache.get(storedSettings.logchannel)) return;
    newChannel.guild.channels.cache.get(storedSettings.logchannel).send(embed)
  } catch (e) {}
};
