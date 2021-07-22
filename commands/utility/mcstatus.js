const { MessageEmbed } = require("discord.js");
const status = require('minecraft-server-status');
module.exports = {
  name: "mcstatus",
  description: "Get status of mc server!",
  category: "utility",
  usage: "`mcstatus [ip]`",
  run: async (bot, message, args, userinfo) => {
    let Embed2 = new MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} | You did not specify a ip! | \`mcstatus [ip]\``)
        .setColor(userinfo.color);
    if(!args[0]) return message.channel.send(Embed2);
    status(args[0], 25565, response => {
      if (response.players.max == 0) return message.channel.send(Embed2);
      let Embed = new MessageEmbed();
          Embed.setColor(userinfo.color)
          Embed.setTitle(args[0])
          Embed.setDescription('____________________________')
          Embed. setThumbnail(`https://eu.mc-api.net/v3/server/favicon/${args[0]}`)
          Embed.addField(`Online:`, response.online)
          Embed.addField(`Players online:`, `${response.players.now}/${response.players.max}`)
          message.channel.send(Embed);
  })
  },
};
