const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  name: "withdraw",
  description: "Withdraw money!",
  category: "economy",
  usage: "`withdraw [amount]`",
  aliases: ['with'],
  run: async (bot, message, args, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings.economy) return message.channel.send(`Economy is disabled in this guild!`);
    var userData = await money.findOne({gid: message.guild.id, userid: message.author.id});
    if (!userData || userData.bank === 0) return bot.error(`You don't have any 🍣 to withdraw`, message.channel);
    if (parseInt(args[0]) === userData.bank || args[0] === `all` || args[0] === `max`) {
      money.findOne(
        { gid: message.guild.id, userid: message.author.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = data.hand + userData.bank,
              data.bank = 0;
              data.save();
          }
        );
         return message.channel.send(`${bot.info.emojis.normal.check} You withdrawed 🍣 **${userData.bank}**!`);   
    }
    if (!parseInt(args[0])) return bot.error(`you did not specify an correct amount`, message.channel);
    if (userData.bank <= parseInt(args[0])) return bot.error(`You don't have so many 🍣 on the bank!`, message.channel);
    money.findOne(
      { gid: message.guild.id, userid: message.author.id},
        async (err, data) => {
          if (err) throw err;
            data.hand = data.hand + parseInt(args[0]);
            data.bank = data.bank - parseInt(args[0]);
            data.save();
        }
      );
      message.channel.send(`${bot.info.emojis.normal.check} You withdrawed 🍣 **${args[0]}**!`);    
  },
};
