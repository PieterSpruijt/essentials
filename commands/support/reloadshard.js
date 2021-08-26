const Discord = require('discord.js');

module.exports = {
  name: "reloadshard",
  description: "Special developer command!",
  category: "support",
  usage: "`reloadshard [shardid]`",
  run: async (bot, message, args, userinfo) => {
    if (!userinfo.developer) {
      let Embed = new Discord.MessageEmbed()
        .setDescription(`${bot.info.emojis.normal.cross} You are not allowed to use the args command\n This command is only for the Essentials support team!`)
        .setColor(`#e91e63`);
    message.channel.send(Embed)
    }
    if (userinfo.developer) {
      if (parseInt(args[0]) <= bot.shard.client.ws.totalShards || parseInt(args[0]) === bot.shard.client.ws.totalShards)
      bot.shard.broadcastEval(`if (this.shard.ids.includes(${parseInt(args[0])})) process.exit();`).then(
        message.channel.send(`Shard ${args[0]} is reloaded!`)
      )
    } else {
      message.channel.send(`shard not found!`)
    }
    
  },
};
