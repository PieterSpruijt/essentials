const Discord = require("discord.js");
let rewards = require("../../models/joinrole");

module.exports = {
  name: "deljoinrole",
  description: "Delete a join role",
  category: "invites",
  usage: "deljoinrole",
  run: async (bot, message, args, userinfo) => {
    if (!message.member.permissions.has(bot.perms.ADMINISTRATOR)) return bot.error(`You Dont have Permission to do that! You must be Administrator!`, message.channel);
        if (!args[0]) return bot.error(`You did not specify a role!`, message.channel);
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(" "));
        if (!role) return bot.error(`I can't find that role!`, message.channel);
        let _ = await rewards.findOne({gid: message.guild.id, Role: role.id});
        if (!_) return bot.error(`I can't find that join role!`, message.channel);
        var deleted = await rewards.deleteOne({gid: message.guild.id, Role: role.id});
        let embed = new Discord.MessageEmbed()
        .setTitle(`Join role deleted`)
        .setColor(userinfo.color)
        .setDescription(`<@&${role.id}> will now not be longer given!`);
        message.channel.send({embeds: [embed]});
  },
};
