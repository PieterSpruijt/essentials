const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "howgay",
  description: "Get howgay a user is.",
  category: "fun",
  usage: "`howgay <mention/id>`",
  run: async (bot, message, args, userinfo) => {
    let user = message.mentions.users.first() || bot.users.cache.get(args[0])
    if (!user) {
      user = message.author
    }
    let procent = Math.floor(Math.random() * 101);
    let Embed = new MessageEmbed()
    .setDescription(`${user.username} is ${procent}% gay :gay_pride_flag:`)
    .setColor(userinfo.color);
    message.channel.send({embeds: [Embed]})
  },
};
