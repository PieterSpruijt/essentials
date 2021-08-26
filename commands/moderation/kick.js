const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "kick",
  description: "Kick a member!",
  category: "moderation",
  usage: "`kick [mention] [reason]`",
  run: async (bot, message, args, userinfo) => {
    if (!message.guild.me.permissions.has(bot.perms.KICK_MEMBERS)) return message.channel.send(`${bot.info.emojis.normal.cross} | I Dont have Permission to do that!`)
    if (!message.member.permissions.has(bot.perms.KICK_MEMBERS)) return message.channel.send(`${bot.info.emojis.normal.cross} | You Dont have Permission to do that!`)
    let User = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if (!User) return message.channel.send(`${bot.info.emojis.normal.cross} | You did not mention a user! | \`kick [mention] [reason]\``)
    if (User.permissions.has(bot.perms.KICK_MEMBERS)) return message.reply(`${bot.info.emojis.normal.cross} | You can't kick a moderator`)
    if (User.permissions.has(bot.perms.BAN_MEMBERS)) return message.reply(`${bot.info.emojis.normal.cross} | You can't kick a moderator`)
    let Reason = args.join(" ").slice(22);
    if (!Reason) {
      Reason = "None"
    }
    User.send(`you are kicked from **${message.guild.name}** for "${Reason}"`)
    message.guild.members.kick(User.id, {reason: Reason}).catch(error => {
      message.channel.send(`**I can't kick this user!**`);
    })
    message.channel.send(`${User} is succesfull kicked for "${Reason}"`)
  },
};

