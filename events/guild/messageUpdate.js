const { MessageEmbed } = require("discord.js");
const logchannel = require("../../models/logchannel");
const userdb = require("../../models/userdb");
module.exports = async (oldMessage, newMessage) => {
  try {
    if (oldMessage.content === newMessage.content) {
                return;
            }

            if (oldMessage.author.bot) return;
            let userinfo2 = await userdb.findOne({ userid: oldMessage.author.id });
    if (!userinfo2) userinfo2.snipe = true;
    if (userinfo2.snipe) {
      const snipes = oldMessage.client.editsnipes.get(oldMessage.channel.id) || [];
    snipes.unshift({
      oldContent: oldMessage.content,
      newContent: newMessage.content,
      author: oldMessage.author,
      image: oldMessage.attachments.first()
        ? oldMessage.attachments.first().proxyURL
        : null,
      date: new Date().toLocaleString("en-GB", {
        dataStyle: "full",
        timeStyle: "short",
      }),
    });
    snipes.splice(10);
    oldMessage.client.editsnipes.set(oldMessage.channel.id, snipes);
    }

            var content = oldMessage.conten;
            if (!content) content = "No text to be found";

            var respone = `**Message changed <@${oldMessage.author.id}> in ${oldMessage.channel}**\n **From:** \n${oldMessage}\n **To:** \n${newMessage}`;

            var embed = new MessageEmbed()
                .setAuthor(`${oldMessage.author.tag}`, `${oldMessage.author.avatarURL({ size: 4096 })}`)
                .setDescription(respone)
                .setFooter(`Author: ${oldMessage.author.id} | Message id: ${oldMessage.id}`)
                .setTimestamp()
                .setColor(`BLUE`)

    var storedSettings = await logchannel.findOne({ gid: newMessage.guild.id });
    if (!newMessage.guild.channels.cache.get(storedSettings.logchannel)) return;
    newMessage.guild.channels.cache.get(storedSettings.logchannel).send(embed)
  } catch (e) {}
};
