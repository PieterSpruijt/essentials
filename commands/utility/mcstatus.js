const { MessageEmbed } = require("discord.js");
const status = require('minecraft-server-status');
module.exports = {
  name: "mcstatus",
  description: "Get status of mc server!",
  category: "utility",
  usage: "`mcstatus [ip]`",
  run: async (bot, message, args, userinfo) => {
    if(!args[0]) return bot.error(`You did not specify a ip!`, message.channel);
    status(args[0], 25565, response => {
      if (response.players.max == 0) return bot.error(`You did not specify a ip!`, message.channel);
      let Embed = new MessageEmbed();
          Embed.setColor(userinfo.color)
          Embed.setTitle(args[0])
          Embed.setDescription('____________________________')
          Embed. setThumbnail(`https://eu.mc-api.net/v3/server/favicon/${args[0]}`)
          Embed.addField(`Online:`, response.online)
          Embed.addField(`Players online:`, `${response.players.now}/${response.players.max}`)
          message.channel.send({embeds: [Embed]});
  })
  },
};
