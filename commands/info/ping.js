const Discord = require("discord.js");

module.exports = {
  name: "ping",
  category: "info",
  usage: "`ping`",
  description: "Returns latency and API ping",
  timeout: 10000,
  run: async (bot, message, args, userinfo) => {
    message.channel.send(`${bot.info.emojis.animated.loading} | 🏓 Pinging....`).then((msg) => {
      const _ = new Discord.MessageEmbed()
      .setTitle(`🏓 | Ping menu`)
      .setDescription(`🏓 | Pong \n📊 | ms & latency`)
      .setColor(userinfo.color);
      const pongembed = new Discord.MessageEmbed()
      .setTitle(`🏓 Pong`)
      .setColor(userinfo.color);

        const msANDlatency = new Discord.MessageEmbed()
    .setTitle(`<:essentials:815250559736217660> | ms & latency`)
    .setDescription(`Latency is ${Math.floor(
      msg.createdTimestamp - message.createdTimestamp
    )}ms\nAPI Latency is ${Math.round(bot.ws.ping)}ms`)
    .setColor(userinfo.color);

      msg.react(`🏓`).catch(e => {});
      msg.react(`📊`).catch(e => {});

      msg.edit(_).catch(e => {});
      msg.edit("\u200B").catch(e => {});
    bot.on(`messageReactionAdd`, (reaction, user) => {
        if(user.id != message.author.id) return; //Deze ID staat al goed
        if (reaction.message.id != msg.id) return;
        if(reaction.emoji.name === `📊`) {
            msg.reactions.removeAll().catch(e => {});
            msg.edit(msANDlatency);  
        }
        if(reaction.emoji.name === `🏓`) {
          msg.reactions.removeAll().catch(e => {});
          msg.edit(pongembed);
         
      }
    });
    });
  },
};