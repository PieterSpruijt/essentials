const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "reroll",
  description: "reroll giveaway",
  usage: "`reroll [message ID]`",
  category: "fun",
  run: async (bot, message, args, userinfo) => {
    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You don't have access to do this!`, message.channel)

    if(!args[0]) return bot.error(`I  can't find that message!`, message.channel)
    let messageID = args[0];
    bot.giveawaysManager.reroll(messageID, {
        messages: {
            congrat: "Congratulation, {winners}! You're the new winner!",
            error: "Giveaway cancelled, not enough participants."
        }
    }).catch((err) => {
      bot.error(`I can't find that message!`, message.channel)
    });   
  },
};
