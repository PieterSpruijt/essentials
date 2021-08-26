const model = require("../../models/invites");
const Discord = require("discord.js");

module.exports = {
  name: "delinvites",
  description: "Remove invites!",
  category: "invites",
  usage: "`delinvites [total/invites/left] [amount]`",
  run: async (bot, message, args, userinfo) => {
    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You Dont have Permission to do that! You must be Administrator!`, message.channel);
    let user = message.mentions.users.first() || bot.users.cache.get(args[0]);
    if (!args[1]) return bot.error(`You did not specify a category: [total/invites/left]`, message.channel);
    if (!args[2]) return bot.error(`You did not specify an amount to add!`, message.channel);
    if (!parseInt(args[2])) return bot.error(`That's not a number!`, message.channel);
    let amount = parseInt(args[2]);
    let userData = await model.findOne({gid: message.guild.id, userid: user.id});
    if (!userData) {
      return bot.error(`This user has no invites to remove!`, message.channel);
    }
    if (args[1] === `total`) {
      model.findOne(
        { gid: message.guild.id, userid: user.id },
        async (err, data) => {
          if (err) throw err;
            data.total = data.total - amount;
            data.save();
        }
      );
      message.channel.send(`Removed ${amount} total invites`);

    } else if (args[1] === `left`) {
      model.findOne(
        { gid: message.guild.id, userid: user.id },
        async (err, data) => {
          if (err) throw err;
            data.left = data.left - amount;
            data.save();
        }
      );
      message.channel.send(`Removed ${amount} left`);
      
    } else if (args[1] === `invites`) {
      model.findOne(
        { gid: message.guild.id, userid: user.id },
        async (err, data) => {
          if (err) throw err;
            data.invites = data.invites - amount;
            data.save();
        }
      );
      message.channel.send(`Removed ${amount} invites`);
      
    } else {
      return bot.error(`You did not specify a correct category: [total/invites/left]`, message.channel);
    }
  },
};
