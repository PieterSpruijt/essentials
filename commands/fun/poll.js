const Discord = require("discord.js");

module.exports = {
  name: "poll",
  description: "Create a simple yes or no poll",
  category: "fun",
  usage: "`poll [mention/channelID] [poll]`",
  run: async (bot, message, args, userinfo) => {
    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR))
      return bot.error(`You Dont have Permission to do that! You must be Administrator!`, message.channel)
    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);
    if (!channel) {
      return bot.error(`You did not mention / give the id of your channel!`, message.channel)
    }
    let question = message.content
      .split(`${bot.prefix}poll ${channel} `)
      .join("");
    if (!question)
      return bot.error(`You did not specify your question!`, message.channel)
    const Embed = new Discord.MessageEmbed()
      .setTitle(`New poll!`)
      .setDescription(`${question}`)
      .setFooter(`${message.author.username} created this poll.`)
      .setColor(userinfo.color);
    let msg = await bot.channels.cache.get(channel.id).send({embeds: [Embed]});
    await msg.react("👍");
    await msg.react("👎");
  },
};
