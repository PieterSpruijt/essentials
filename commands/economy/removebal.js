const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  name: "removebal",
  description: "Remove money!",
  category: "economy",
  usage: "`removebal [userid/mention] [amount]`",
  run: async (bot, message, args, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings.economy) return message.channel.send(`Economy is disabled in this guild!`);
    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You doný have Admin perms!`, message.channel);

    let User = message.mentions.users.first() || bot.users.cache.get(args[0]);
    if (!User) return bot.error(`You did not specify an user!`, message.channel);
    if (User.bot) return bot.error(`Bots can't have  🍣!`, message.channel);
    if (!(parseInt(args[1]) > 0)) return bot.error(`You did not specify a correct amount of 🍣!`, message.channel);
    var userData = await money.findOne({gid: message.guild.id, userid: User.id});
    if (!userData) {
      message.channel.send(`This user has no balance!`);
    } else {
      money.findOne(
        { gid: message.guild.id, userid: User.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = data.hand - parseInt(args[1]);
              data.save();
          }
        );
        message.channel.send(`Removed **${parseInt(args[1])}** 🍣 of **${User.tag}**'s balance`);
    }
  },
};
