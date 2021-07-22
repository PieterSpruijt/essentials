const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "announce",
  description: "Get the bot to say what ever you want in a specific channel.",
  usage: "announce [mention/channelID] [announcement]",
  run: async (bot, message, args, userinfo) => {
    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) {
      return bot.error(`You Dont have Permission to do that! You must be Administrator!`, message.channel)
    }
    if (message.member.permissions.has(bot.perms.ADMINISTRATOR)) {
      let rChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if (!rChannel)
      return bot.error(`You did not specify your channel to send the announcement to!`, message.channel)
    //console.log(rChannel);
    let MSG = args.slice(1).join(" ");
    if (!MSG)
      return bot.error(`You did not specify your message to send!`, message.channel)
    const _ = new MessageEmbed()
      .setTitle(`New announcement!`)
      .setDescription(`${MSG}`)
      .setColor(userinfo.color);
    rChannel.send({embeds: [_]}).catch(error => {message.channel.send(`I can't send a message in <#${rChannel.id}>!`)})
    message.channel.send(`Announcement send in <#${rChannel.id}>`)
    }  
  },
};
