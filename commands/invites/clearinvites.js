const model = require("../../models/invites");
const Discord = require("discord.js");

module.exports = {
  name: "clearinvites",
  description: "Clear all invites!",
  category: "invites",
  usage: "`clearinvites`",
  run: async (bot, message, args, userinfo) => {
    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You Dont have Permission to do that! You must be Administrator!`, message.channel);
    var total = (await model.find({gid: message.guild.id})).length;
    var deleted = await model.deleteMany({gid: message.guild.id});
    message.channel.send(`Deleted invites of ${total} users`);
    
  },
};
