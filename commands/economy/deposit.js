const Discord = require("discord.js");
const money = require('../../models/economy');
module.exports = {
  name: "deposit",
  description: "Deposit money on bank",
  aliases: ["dep"],
  category: "economy",
  usage: "`deposit [amount]`",
  run: async (bot, message, args, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings.economy) return message.channel.send(`Economy is disabled in this guild!`);
    var userData = await money.findOne({gid: message.guild.id, userid: message.author.id});
    if (!userData || userData.hand === 0) return bot.error(`You don't have any 🍣 to deposit`, message.channel);
    if (parseInt(args[0]) === userData.hand || args[0] === `all` || args[0] === `max`) {
      money.findOne(
        { gid: message.guild.id, userid: message.author.id},
          async (err, data) => {
            if (err) throw err;
              data.hand = 0,
              data.bank = data.bank + userData.hand;
              data.save();
          }
        );
         return message.channel.send(`${bot.info.emojis.normal.check} You deposit 🍣 **${userData.hand}** on the bank!`);
    }
    if (!parseInt(args[0])) return bot.error(`you did not specify an correct amount`, message.channel);
    if (userData.hand <= parseInt(args[0])) return bot.error(`You don't have so many 🍣 in your hand!`, message.channel);
    

  },
};