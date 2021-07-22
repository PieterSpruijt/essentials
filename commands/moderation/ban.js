module.exports = {
  name: "ban",
  description: "Ban a member!",
  category: "moderation",
  usage: "`ban [mention] [reason]`",
  run: async (bot, message, args, userinfo) => {
    if (!message.guild.me.permissions.has(bot.perms.BAN_MEMBERS)) return message.channel.send(`${bot.info.emojis.normal.cross} | I Dont have Permission to do that!`)
    if (!message.member.permissions.has(bot.perms.BAN_MEMBERS)) return message.channel.send(`${bot.info.emojis.normal.cross} | You Dont have Permission to do that!`)
    let User = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!User) return message.channel.send(`${bot.info.emojis.normal.cross} | You did not mention a user! | \`ban [mention] [reason]\``)
    if (User.permissions.has(bot.perms.KICK_MEMBERS)) return message.reply(`${bot.info.emojis.normal.cross} | You can't ban a moderator`)
    if (User.permissions.has(bot.perms.BAN_MEMBERS)) return message.reply(`${bot.info.emojis.normal.cross} | You can't ban a moderator`)
    let banReason = args.join(" ").slice(22);
    if (!banReason) {
      banReason = "None"
    }
    User.send(`you are banned from **${message.guild.name}** for "${banReason}"`).then(User => {
      message.guild.members.ban(User.id, {reason: banReason}).catch(error => {
        bot.error(`Something went wrong`, message.channel)
      }).then(
        message.channel.send(`${User} is banned for "${banReason}"`)
      )
    })
  },
};
