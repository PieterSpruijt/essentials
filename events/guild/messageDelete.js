const { MessageEmbed } = require("discord.js");
const logchannel = require("../../models/logchannel");
const userdb = require("../../models/userdb");
module.exports = async (message) => {
  try {
    if (message.author.bot) return;
    let userinfo2 = await userdb.findOne({ userid: message.author.id });
    if (!userinfo2) userinfo2.snipe = true;
    if (userinfo2.snipe) {
      const snipes = message.client.snipes.get(message.channel.id) || [];
    snipes.unshift({
      content: message.content,
      author: message.author,
      image: message.attachments.first()
        ? message.attachments.first().proxyURL
        : null,
      date: new Date().toLocaleString("en-GB", {
        dataStyle: "full",
        timeStyle: "short",
      }),
    });
    snipes.splice(10);
    message.client.snipes.set(message.channel.id, snipes);
    }

    var content = message.content;
            if (!content) content = "No text to be found";

            var respone = `**Message of <@${message.author.id}> has been removed from ${message.channel}** \n${message}`;

            var embed = new MessageEmbed()
                .setAuthor(`${message.author.tag}`, `${message.author.avatarURL({ size: 4096 })}`)
                .setDescription(respone)
                .setFooter(`Author: ${message.author.id} | Message id: ${message.id}`)
                .setTimestamp()
                .setColor(`BLUE`)

    var storedSettings = await logchannel.findOne({ gid: message.guild.id });
    if (!message.guild.channels.cache.get(storedSettings.logchannel)) return;
    message.guild.channels.cache.get(storedSettings.logchannel).send(embed)
  } catch (e) {}
};
