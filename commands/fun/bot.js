const token = require('../../token.json');
const DBL = require('dblapi.js');
const { MessageEmbed } = require("discord.js");


module.exports = {
  name: "bot",
  description: "get info about a bot!",
  category: "fun",
  usage: "`bot [mention/id]`",
  run: async (bot, message, args, userinfo) => {
    let dbl = new DBL(token.dbltoken, bot);
    let bot2 = bot.users.cache.get(args[0]).id || message.mentions.users.first().id || args[0];

        dbl.getBot(`${bot2}`).then(bot2 => {
          let Embed = new MessageEmbed();
          Embed.setColor(userinfo.color)
          Embed.setTitle(`${bot2.username}#${bot2.discriminator}`)
          Embed.setDescription('____________________________')
          Embed. setThumbnail(`https://images.discordapp.net/avatars/${args}/${bot2.avatar}.png?size=512`)
          if (bot2.id) Embed.addField(`ID:`, bot2.id, true)
          if (bot2.username) Embed.addField(`Bot name:`, bot2.username, true)
          if (bot2.discriminator) Embed.addField(`Discriminator:`, `${bot2.discriminator}`, true)
          if (bot2.shortdesc) Embed.addField(`Short Description:`, bot2.shortdesc, true)
          if (bot2.lib) Embed.addField(`Libary`, bot2.lib, true)
          if (bot2.prefix) Embed.addField(`Prefix`, bot2.prefix, true)
          if (bot2.points) Embed.addField(`Votes:`, bot2.points, true)
          if (bot2.monthlyPoints) Embed.addField(`Votes this month:`, bot2.monthlyPoints, true)
          if (bot2.owners) Embed.addField(`Owner(S):`, `<@${bot2.owners}>`, true)
          if (bot2.invite, bot2.website, bot2.github) Embed.addField(`Links`, `[Invite](${bot2.invite}) | [Website](${bot2.website}) | [Github](${bot2.github})`, true)
          message.channel.send({embeds: [Embed]});
        }).catch(error => {
          bot.error(`You did not specify an user id to check!`, message.channel)
        });
      
  },
};