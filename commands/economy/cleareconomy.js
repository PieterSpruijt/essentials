const Discord = require('discord.js');
const money = require('../../models/economy');

module.exports = {
  name: "cleareconomy",
  description: "Clear economy of server",
  category: "economy",
  usage: "`cleareconomy`",
  run: async (bot, message, args, userinfo) => {
    const GuildSettings = require("../../models/settings");
    var storedSettings = await GuildSettings.findOne({ gid: message.guild.id });
    if (!storedSettings.economy) return message.channel.send(`Economy is disabled in this guild!`);
    if (!message.member.permissions.has("ADMINISTRATOR")) return bot.error(`You doný have Admin perms!`, message.channel);
    var Data = await money.find({ gid: message.guild.id});
    let size = Data.length;
    var deleted = await money.deleteMany({gid: message.guild.id});
    message.channel.send(`Successfull deleted ${size} user profiles of this server!`);

    
  },
};
