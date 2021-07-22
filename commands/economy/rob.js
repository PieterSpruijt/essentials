const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  name: "rob",
  description: "Rob other people",
  category: "economy",
  usage: "`rob [id/mention]`",
  timeout: 3600000,
  run: async (bot, message, args, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings.economy) return message.channel.send(`Economy is disabled in this guild!`);
    const User = message.mentions.users.first() || bot.users.cache.get(args[0]);
    if (!User) return bot.error(`You did not specify an user!`, message.channel);
    if (User === message.author) return bot.error(`You can't rob yourself!`, message.channel);
    if (User.bot) return bot.error(`You can't rob a bot!`, message.channel);
    var userData = await money.findOne({gid: message.guild.id, userid: message.author.id});
    var user2Data = await money.findOne({gid: message.guild.id, userid: User.id});
    if (!user2Data || user2Data.hand <= 200) {
      return bot.error(`This user hasn't got at least 🍣 200 on hand!`, message.channel);
    }
    var rating = Math.floor(Math.random() * 3) + 1;
    var amount = Math.floor(Math.random() * 200) + 1;
    if (rating != 1) return message.channel.send(`You got seen by police, try again in 2h!`);
    if (!userData) {
      const newSettings = new money({ 
        gid: message.guild.id,
        userid: message.author.id,
        bank: 0,
        hand: amount
      });
      await newSettings.save().catch(()=>{});
        money.findOne(
          { gid: message.guild.id, userid: User.id},
            async (err, data) => {
              if (err) throw err;
                data.hand = data.hand - amount;
                data.save();
            }
          );
        message.channel.send(`${bot.info.emojis.normal.check} | You successfully robbed **${User.tag}** and stole 🍣 **${amount}**!`);
    } else {
      money.findOne(
        { gid: message.guild.id, userid: message.author.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = data.hand + amount;
              data.save();
          }
        );
        money.findOne(
          { gid: message.guild.id, userid: User.id},
            async (err, data) => {
              if (err) throw err;
                data.hand = data.hand - amount;
                data.save();
            }
          );
          message.channel.send(`${bot.info.emojis.normal.check} | You successfully robbed **${User.tag}** and stole 🍣 **${amount}**!`);
    }


  },
};
