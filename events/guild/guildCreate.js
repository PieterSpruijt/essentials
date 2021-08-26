const Discord = require('discord.js');
const embed = require('../../embed.json');
const embed2 = require('../../embed.json');
const ids = require("../../ids.json");
const config = require("../../config.json")
const token = require("../../token.json");
const webhookClient = new Discord.WebhookClient(token.webhooks['new-servers'][0], token.webhooks['new-servers'][1]);


module.exports = async (bot, guild) => {
  try {
    let newembed = new Discord.MessageEmbed()
      .setTitle(`New Server: "${guild.name}" with id: "${guild.id}\nNow in ${bot.guilds.cache.size} Servers"`)
      .setColor('#e91e63')
      .setFooter(embed2.footer_name)
      .setTimestamp();
  webhookClient.send({embeds: [newembed]});
  let defaultChannel = "";
  guild.channels.cache.forEach((channel) => {
    if(channel.type == "text" && defaultChannel == "") {
      if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
        defaultChannel = channel;
      }
    }
  })
  const Embed2 = new Discord.MessageEmbed()
  Embed2.setColor('#7289da')
  Embed2.setTitle(`thanks for inviting ${bot.user.username}`)
  Embed2.setAuthor(embed.Botname, embed.profielfoto, embed.website)
  Embed2.setThumbnail(embed.profielfoto)
  Embed2.addFields(
        { name: 'How to set prefix?', value: `the default prefix is ​​${bot.prefix} you can set a new one by doing \`${config.prefix}prefix [new prefix]\`` },
        { name: 'I need help what now?', value: `You can reach us by clicking [HERE](${config.website}). we also have a discord help server click [HERE](${config.support_server}).` },
        { name: 'Invite the bot!', value: `You can invite the bot by pressing [HERE](${config.inviteurl})` }
    )
  Embed2.setFooter(embed.footer_name, embed.footer_foto);
  defaultChannel.send({embeds: [Embed2]})
  defaultChannel.send(config.support_server); 
  } catch (e) {}
};