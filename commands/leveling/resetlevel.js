const Discord = require("discord.js")
const xpdb = require("../../models/xpdb");

module.exports = {
  name: "resetlevel",
  description: "Reset someones level!",
  category: "leveling",
  usage: "reselevel [mention/id]",
  run: async (bot, message, args, userinfo) => {
    if (!userinfo.developer && !message.member.permissions.has(bot.perms.ADMINISTRATOR)) bot.error(`You Dont have Permission to do that! You must be Administrator!`, message.channel);
    let User = message.mentions.users.first() || bot.users.cache.get(args[0]);
    if (!User) return bot.error(`I can't find that user!`, message.channel);

    const userData = await xpdb.findOne({ id: `${message.guild.id}_${User.id}` });
    if (!userData) return bot.error(`This users hasn't got a rank!`, message.channel);
    deleted = await xpdb.deleteOne({ id: `${message.guild.id}_${User.id}` });
    message.channel.send(`Deleted **${User.tag}**'s rank!`);
  },
};
