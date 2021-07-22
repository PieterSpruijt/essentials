const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "epicgamerrate",
  description: "Get how epicgame a user is.",
  category: "fun",
  usage: "`epicgamerrate <mention/id>`",
  run: async (bot, message, args, userinfo) => {
    let user = message.mentions.users.first() || bot.users.cache.get(args[0])
    if (!user) {
      user = message.author
    }
    let procent = Math.floor(Math.random() * 101);
    let Embed = new MessageEmbed()
    .setTitle(`epic gamer rate machine`)
    .setDescription(`${user.username} is ${procent}% epic gamer 😎`)
    .setColor(userinfo.color);
    message.channel.send({embeds: [Embed]})
  },
};
