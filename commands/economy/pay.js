const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  name: "pay",
  description: "Give someone money!",
  category: "economy",
  usage: "`pay [userid/mention] [amount]`",
  run: async (bot, message, args, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings.economy) return message.channel.send(`Economy is disabled in this guild!`);
    let User = message.mentions.users.first() || bot.users.cache.get(args[0]);
    if (User === message.author) return bot.error(`You can't give yourself 🍣!`, message.channel)
    if (!User) return bot.error(`You did not specify an user to send 🍣 to!`, message.channel);
    if (User.bot) return bot.error(`You can't give bots 🍣!`, message.channel);
    if (!parseInt(args[1])) return bot.error(`You did not specify a correct amount of 🍣!`, message.channel);
    var userData = await money.findOne({gid: message.guild.id, userid: message.author.id});
    if (!userData) return bot.error(`You don't have any 🍣!`, message.channel);
    if (userData.hand <= parseInt(args[1])) return bot.error(`You don't have enough 🍣 in your hand!`, message.channel);
    var user2Data = await money.findOne({gid: message.guild.id, userid: User.id});
    if (!user2Data) {
      const newSettings = new money({ 
        gid: message.guild.id,
        userid: User.id,
        bank: 0,
        hand: parseInt(args[1])
      });
      await newSettings.save().catch(()=>{});
        money.findOne(
          { gid: message.guild.id, userid: message.author.id},
            async (err, data) => {
              if (err) throw err;
                data.hand = data.hand - parseInt(args[1]);
                data.save();
            }
          );
        message.channel.send(`${bot.info.emojis.normal.check} | You successfully paid **${User.tag}** 🍣 **${args[1]}**!`);

    } else {
      money.findOne(
        { gid: message.guild.id, userid: User.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = data.hand + parseInt(args[1]);
              data.save();
          }
        );
        money.findOne(
          { gid: message.guild.id, userid: message.author.id},
            async (err, data) => {
              if (err) throw err;
                data.hand = data.hand - parseInt(args[1]);
                data.save();
            }
          );
        message.channel.send(`${bot.info.emojis.normal.check} | You successfully paid **${User.tag}** 🍣 **${args[1]}**!`);
    }
  },
};
