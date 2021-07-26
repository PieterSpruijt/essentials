const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  name: "addbal",
  description: "Give someone money!",
  category: "economy",
  usage: "`addbal [userid/mention] [amount]`",
  run: async (bot, message, args, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings.economy) return message.channel.send(`Economy is disabled in this guild!`);
    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You doný have Admin perms!`, message.channel);

    let User = message.mentions.users.first() || bot.users.cache.get(args[0]);
    if (!User) return bot.error(`You did not specify an user to send 🍣 to!`, message.channel);
    if (User.bot) return bot.error(`You can't give bots 🍣!`, message.channel);
    if (!(parseInt(args[1]) > 0)) return bot.error(`You did not specify a correct amount of 🍣!`, message.channel);
    var userData = await money.findOne({gid: message.guild.id, userid: User.id});
    if (!userData) {
      const newSettings = new money({ 
        gid: message.guild.id,
        userid: User.id,
        bank: 0,
        hand: parseInt(args[1])
      });
      await newSettings.save().catch(()=>{});
      message.channel.send(`Added **${parseInt(args[1])}** 🍣 to **${User.tag}**'s balance`);
    } else {
      money.findOne(
        { gid: message.guild.id, userid: User.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = data.hand + parseInt(args[1]);
              data.save();
          }
        );
        message.channel.send(`Added **${parseInt(args[1])}** 🍣 to **${User.tag}**'s balance`);
    }
  },
};
