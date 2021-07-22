const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "role",
  description: "Add/remove someones roles!",
  category: "utility",
  usage: "`role [userid/mention] [role name/id/mention]`",
  run: async (bot, message, args, userinfo) => {
    var User = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(u => u.user.username === args[0]) || message.guild.members.cache.find(u => u.user.tag === args[0]);
    var role = message.guild.roles.cache.get(args[1]) || message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name === args[1]);
    if (!message.member.hasPermission("MANAGE_ROLES")) return bot.error(`You Dont have Permission to do that!`, message.channel);
    if (message.member.roles.highest.rawPosition <= role.rawPosition) return bot.error(`You Dont have Permission to do that!`, message.channel);
    if (!User) return bot.error(`I can't find that user!`, message.channel);
    if (!role) return bot.error(`I can't find that role`, message.channel);
    if (message.guild.me.roles.highest.rawPosition <= User.roles.highest.rawPosition || message.guild.me.roles.highest.rawPosition <= role.rawPosition) {
      return bot.error(`You don't have the perms to do that!`, message.channel)       
    } else {
      if (User.roles.cache.has(role.id)) {
        User.roles.remove(role).catch(e => {
            return bot.error(`Something went wrong with removing the role!`, message.channel);
         });
         message.channel.send(`Successfull removed **${role.name}** from **${User.user.tag}**`)
    } else {
        User.roles.add(role).catch(e => {
            return bot.error(`Something went wrong with adding the role!`, message.channel);
         });
         message.channel.send(`Successfull added **${role.name}** to **${User.user.tag}**`)
    }
    }
  },
};
