const Discord = require('discord.js');

module.exports = {
  name: "debug",
  description: "Get debug info!",
  category: "botinfo",
  usage: "`debug`",
  run: async (bot, message, args, userinfo) => {
      let Embed = new Discord.MessageEmbed()
        .setTitle(`Debug info`)
        .addFields(
          {name: `Server ID:`, value: message.guild.id},
          {name: `Shard:`, value: `[${bot.shard.ids}/${bot.shard.client.ws.totalShards} ]`},
          {name: `Server Region:`, value: message.guild.region},
          {name: `Total Memory:`, value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`},
          {name: `Voice channels connected:`, value: bot.voice.connections.size}
        )
        .setColor(userinfo.color);
    message.channel.send(Embed);
    
    
  },
};
